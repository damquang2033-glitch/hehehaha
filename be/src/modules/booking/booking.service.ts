import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus, PaymentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import {
  assertTransition,
  BLOCKING_STATUSES,
  BookingActor,
} from './booking.state-machine';

const HOLD_MINUTES = 10;

const BOOKING_INCLUDE = {
  listing: {
    select: {
      id: true,
      title: true,
      location: true,
      images: true,
      price: true,
      instantBooking: true,
      freeCancelBeforeHours: true,
      partialRefundPercent: true,
    },
  },
  guest: { select: { id: true, name: true, email: true, avatar: true } },
  review: { select: { id: true } },
  payment: { select: { id: true, status: true, amount: true } },
} as const satisfies Prisma.BookingInclude;

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  // ── 1. Kiểm tra phòng trống ──────────────────────────────────────────────────

  async checkAvailability(dto: CheckAvailabilityDto) {
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);
    const now = new Date();

    const conflict = await this.prisma.booking.findFirst({
      where: {
        listingId: dto.listingId,
        OR: [
          // Firm bookings that always block
          { status: { in: BLOCKING_STATUSES } },
          // Active HOLDs (not yet expired)
          { status: BookingStatus.HOLD, holdUntil: { gt: now } },
        ],
        AND: [{ checkIn: { lt: checkOut } }, { checkOut: { gt: checkIn } }],
      },
      select: { id: true, status: true, holdUntil: true },
    });

    return { available: !conflict };
  }

  // ── 2. Giữ phòng (tạo booking tạm thời) ───────────────────────────────
  //
  // Sử dụng PostgreSQL advisory lock (pg_advisory_xact_lock) bên trong
  // một transaction để xử lý tuần tự (serialize) các request giữ phòng
  // đồng thời cho cùng một listing.
  // Điều này đảm bảo không có hai request nào có thể cùng lúc vượt qua
  // bước kiểm tra xung đột (conflict-check).

  async hold(guestId: string, dto: CreateBookingDto) {
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);

    if (checkIn >= checkOut) {
      throw new BadRequestException('Ngày trả phòng phải sau ngày nhận phòng');
    }
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    if (checkIn < today) {
      throw new BadRequestException('Ngày nhận phòng không được ở quá khứ');
    }

    const holdUntil = new Date(Date.now() + HOLD_MINUTES * 60_000);

    return this.prisma.$transaction(async (tx) => {
      // Acquire an exclusive per-listing advisory lock for this transaction.
      // Any concurrent transaction holding the same key will wait here.
      // Lock is automatically released when the transaction ends.
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(1, hashtext(${dto.listingId}))`;

      const listing = await tx.listing.findUnique({
        where: { id: dto.listingId },
      });
      if (!listing) throw new NotFoundException('Listing not found');
      if (listing.hostId === guestId) {
        throw new BadRequestException('Không thể đặt phòng của chính mình');
      }
      if (listing.maxGuests && dto.guestCount > listing.maxGuests) {
        throw new BadRequestException(`Tối đa ${listing.maxGuests} khách`);
      }

      // Conflict check — inside the lock, so it's race-condition-free
      const now = new Date();
      const conflict = await tx.booking.findFirst({
        where: {
          listingId: dto.listingId,
          OR: [
            { status: { in: BLOCKING_STATUSES } },
            { status: BookingStatus.HOLD, holdUntil: { gt: now } },
          ],
          AND: [{ checkIn: { lt: checkOut } }, { checkOut: { gt: checkIn } }],
        },
        select: { id: true },
      });
      if (conflict) {
        throw new BadRequestException(
          'Phòng đã được đặt hoặc đang được giữ trong khoảng thời gian này',
        );
      }

      const nights = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / 86_400_000,
      );
      const totalPrice = listing.price.toNumber() * nights;

      return tx.booking.create({
        data: {
          listingId: dto.listingId,
          guestId,
          checkIn,
          checkOut,
          guestCount: dto.guestCount,
          totalPrice,
          status: BookingStatus.HOLD,
          holdUntil,
          paymentStatus: PaymentStatus.UNPAID,
        },
        include: BOOKING_INCLUDE,
      });
    });
  }

  // ── 3. Fake pay ────────────────────────────────────────────────────────────
  //
  // Immediately confirms a HOLD booking without a real payment gateway.
  // HOLD → CONFIRMED (instantBooking) or HOLD → PENDING (host must approve).

  async fakePay(bookingId: string, guestId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { listing: { select: { instantBooking: true } } },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.guestId !== guestId)
      throw new ForbiddenException('Access denied');
    if (booking.status !== BookingStatus.HOLD) {
      throw new BadRequestException(
        'Chỉ có thể thanh toán booking đang ở trạng thái HOLD',
      );
    }
    if (booking.holdUntil && booking.holdUntil < new Date()) {
      throw new BadRequestException(
        'Booking đã hết hạn giữ phòng. Vui lòng tạo booking mới',
      );
    }

    const fakePaymentId = `fake_pay_${Date.now()}`;
    const nextStatus: BookingStatus = booking.listing.instantBooking
      ? BookingStatus.CONFIRMED
      : BookingStatus.PENDING;

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: nextStatus,
          paymentStatus: PaymentStatus.PAID,
          holdUntil: null,
        },
        include: BOOKING_INCLUDE,
      });

      await tx.payment.create({
        data: {
          bookingId,
          amount: booking.totalPrice,
          currency: 'vnd',
          stripeId: fakePaymentId,
          status: PaymentStatus.PAID,
        },
      });

      return updated;
    });
  }

  // ── 5. Update status (manual by guest / host) ──────────────────────────────

  async updateStatus(id: string, userId: string, dto: UpdateBookingStatusDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        listing: {
          select: {
            hostId: true,
            freeCancelBeforeHours: true,
            partialRefundPercent: true,
          },
        },
        payment: { select: { stripeId: true } },
      },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const isHost = booking.listing.hostId === userId;
    const isGuest = booking.guestId === userId;
    if (!isHost && !isGuest) throw new ForbiddenException('Access denied');

    const actor: BookingActor = isHost ? 'host' : 'guest';
    assertTransition(booking.status, dto.status, actor);

    // Cancellation: compute refund
    let refundAmount: number | undefined;
    if (dto.status === BookingStatus.CANCELLED) {
      refundAmount = this.computeRefund(booking);
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id },
        data: {
          status: dto.status,
          ...(refundAmount !== undefined && { refundAmount }),
          ...(refundAmount && refundAmount > 0
            ? { paymentStatus: PaymentStatus.REFUNDED }
            : {}),
        },
        include: BOOKING_INCLUDE,
      });

      // Update Payment record if refund
      if (refundAmount && refundAmount > 0) {
        await tx.payment.updateMany({
          where: { bookingId: id },
          data: { refundAmount, status: PaymentStatus.REFUNDED },
        });
        // TODO: trigger actual Stripe refund via PaymentService
      }

      return updated;
    });
  }

  // ── 6. List queries ────────────────────────────────────────────────────────

  async findMyBookings(guestId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.booking.findMany({
        where: { guestId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: BOOKING_INCLUDE,
      }),
      this.prisma.booking.count({ where: { guestId } }),
    ]);
    return { data, total, page, limit };
  }

  async findHostBookings(hostId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.booking.findMany({
        where: { listing: { hostId } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: BOOKING_INCLUDE,
      }),
      this.prisma.booking.count({ where: { listing: { hostId } } }),
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: BOOKING_INCLUDE,
    });
    if (!booking) throw new NotFoundException('Booking not found');

    // Re-fetch with host relation to check ownership
    const full = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        ...BOOKING_INCLUDE,
        listing: {
          select: { ...BOOKING_INCLUDE.listing.select, hostId: true },
        },
      },
    });
    if (!full) throw new NotFoundException('Booking not found');

    const isInvolved =
      full.guestId === userId ||
      (full.listing as { hostId: string }).hostId === userId;
    if (!isInvolved) throw new ForbiddenException('Access denied');

    return full;
  }

  // ── 7. Cron: expire stale HOLDs ───────────────────────────────────────────

  async expireStaleHolds(): Promise<number> {
    const result = await this.prisma.booking.updateMany({
      where: {
        status: BookingStatus.HOLD,
        holdUntil: { lt: new Date() },
      },
      data: { status: BookingStatus.CANCELLED },
    });
    return result.count;
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private computeRefund(booking: {
    totalPrice: { toNumber(): number };
    checkIn: Date;
    paymentStatus: PaymentStatus;
    listing: { freeCancelBeforeHours: number; partialRefundPercent: number };
  }): number {
    if (booking.paymentStatus !== PaymentStatus.PAID) return 0;

    const hoursUntilCheckIn =
      (booking.checkIn.getTime() - Date.now()) / 3_600_000;

    if (hoursUntilCheckIn >= booking.listing.freeCancelBeforeHours) {
      return booking.totalPrice.toNumber(); // 100% refund
    }
    return (
      booking.totalPrice.toNumber() *
      (booking.listing.partialRefundPercent / 100)
    );
  }
}
