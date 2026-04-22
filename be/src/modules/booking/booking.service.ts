import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

const BOOKING_INCLUDE = {
  listing: { select: { id: true, title: true, location: true, images: true, price: true } },
  guest: { select: { id: true, name: true, email: true, avatar: true } },
  review: { select: { id: true } },
} as const;

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(guestId: string, dto: CreateBookingDto) {
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);

    if (checkIn >= checkOut) {
      throw new BadRequestException('Ngày trả phòng phải sau ngày nhận phòng');
    }
    if (checkIn < new Date()) {
      throw new BadRequestException('Ngày nhận phòng không được ở quá khứ');
    }

    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
    });
    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.hostId === guestId) {
      throw new BadRequestException('Không thể đặt phòng của chính mình');
    }
    if (listing.maxGuests && dto.guestCount > listing.maxGuests) {
      throw new BadRequestException(`Tối đa ${listing.maxGuests} khách`);
    }

    const conflict = await this.prisma.booking.findFirst({
      where: {
        listingId: dto.listingId,
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        AND: [{ checkIn: { lt: checkOut } }, { checkOut: { gt: checkIn } }],
      },
    });
    if (conflict) throw new BadRequestException('Chỗ ở đã được đặt trong khoảng thời gian này');

    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86_400_000);
    const totalPrice = listing.price.toNumber() * nights;

    return this.prisma.booking.create({
      data: {
        listingId: dto.listingId,
        guestId,
        checkIn,
        checkOut,
        guestCount: dto.guestCount,
        totalPrice,
      },
      include: BOOKING_INCLUDE,
    });
  }

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

  async updateStatus(id: string, userId: string, dto: UpdateBookingStatusDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { listing: { select: { hostId: true } } },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const isHost = booking.listing.hostId === userId;
    const isGuest = booking.guestId === userId;

    if (!isHost && !isGuest) throw new ForbiddenException('Access denied');

    // Guest chỉ được cancel
    if (isGuest && dto.status !== BookingStatus.CANCELLED) {
      throw new ForbiddenException('Guest chỉ có thể hủy booking');
    }
    // Host không được tự set COMPLETED (chỉ system sau check-out)
    if (isHost && dto.status === BookingStatus.COMPLETED) {
      throw new ForbiddenException('Không thể tự đánh dấu completed');
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status: dto.status },
      include: BOOKING_INCLUDE,
    });
  }
}
