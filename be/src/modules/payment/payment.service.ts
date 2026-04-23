import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BookingStatus, PaymentStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { StripeCheckoutSession, StripeEvent, StripeProvider } from './stripe.provider';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly stripe: StripeProvider,
    private readonly config: ConfigService,
  ) {}

  // ── 1. Create Checkout Session ───────────────────────────────────────────────
  //
  // Called when guest clicks "Thanh toán" on the payment page.
  // Validates the HOLD, creates a Stripe Checkout Session, transitions
  // booking HOLD → PENDING, and returns the Stripe-hosted checkout URL.

  async createCheckoutSession(
    bookingId: string,
    guestId: string,
  ): Promise<{ sessionUrl: string }> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        listing: {
          select: { title: true, images: true },
        },
      },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.guestId !== guestId) throw new ForbiddenException('Access denied');

    if (booking.status !== BookingStatus.HOLD) {
      throw new BadRequestException(
        'Chỉ có thể tạo thanh toán cho booking đang ở trạng thái HOLD',
      );
    }
    if (booking.holdUntil && booking.holdUntil < new Date()) {
      throw new BadRequestException(
        'Booking đã hết hạn giữ phòng. Vui lòng tạo booking mới.',
      );
    }

    const frontendUrl = this.config.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    );

    const nights = Math.ceil(
      (booking.checkOut.getTime() - booking.checkIn.getTime()) / 86_400_000,
    );

    // VND is a zero-decimal currency in Stripe — unit_amount is the exact amount
    // in VND, no multiplication by 100 needed.
    const session = await this.stripe.createCheckoutSession({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'vnd',
            unit_amount: Number(booking.totalPrice),
            product_data: {
              name: booking.listing.title,
              description: `${nights} đêm · ${booking.guestCount} khách`,
              ...(booking.listing.images[0]
                ? { images: [booking.listing.images[0]] }
                : {}),
            },
          },
          quantity: 1,
        },
      ],
      metadata: { bookingId },
      // expires_at must be at least 30 min from now (Stripe minimum).
      // We use 30 min regardless of holdUntil so the session has breathing room.
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      success_url: `${frontendUrl}/bookings/${bookingId}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/bookings/${bookingId}/payment?cancelled=1`,
    });

    // HOLD → PENDING: slot is reserved, awaiting Stripe confirmation
    await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.PENDING,
        stripeSessionId: session.id,
      },
    });

    this.logger.log(
      `Checkout session created for booking ${bookingId} [session=${session.id}]`,
    );

    return { sessionUrl: session.url! };
  }

  // ── 2. Stripe Webhook ────────────────────────────────────────────────────────
  //
  // Receives raw body + Stripe-Signature header.
  // Only processes checkout.session.completed.
  // Idempotent: skips if booking is already PAID.

  async handleStripeWebhook(rawBody: Buffer, signature: string): Promise<void> {
    const webhookSecret = this.config.getOrThrow<string>('STRIPE_WEBHOOK_SECRET');

    let event: StripeEvent;
    try {
      event = this.stripe.constructWebhookEvent(rawBody, signature, webhookSecret);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Webhook signature verification failed: ${msg}`);
      // Throw 400 — Stripe will NOT retry on 4xx, surfacing the config problem
      throw new BadRequestException(`Invalid webhook signature: ${msg}`);
    }

    this.logger.log(`Stripe event: ${event.type} [id=${event.id}]`);

    if (event.type === 'checkout.session.completed') {
      await this.processCheckoutCompleted(
        event.data.object as StripeCheckoutSession,
      );
    }

    // Other event types are acknowledged with 200 and ignored
  }

  // ── Private: process checkout.session.completed ──────────────────────────────

  private async processCheckoutCompleted(
    session: StripeCheckoutSession,
  ): Promise<void> {
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      this.logger.error(
        `checkout.session.completed missing bookingId in metadata [session=${session.id}]`,
      );
      return; // Return (not throw) — avoids Stripe retrying an unfixable event
    }

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      this.logger.error(
        `Booking ${bookingId} not found [session=${session.id}]`,
      );
      return;
    }

    // ── Idempotency guard ────────────────────────────────────────────────────
    // Stripe may deliver the same event more than once. Skip if already PAID.
    if (booking.paymentStatus === PaymentStatus.PAID) {
      this.logger.log(
        `Booking ${bookingId} already PAID — duplicate webhook skipped`,
      );
      return;
    }

    // ── Edge case: hold expired before payment completed ─────────────────────
    // The guest paid after holdUntil. We still confirm to avoid taking money
    // without giving the booking. In production you'd also check for conflicts
    // and issue a refund if a conflicting booking was confirmed in the meantime.
    if (
      booking.holdUntil &&
      booking.holdUntil < new Date() &&
      booking.status === BookingStatus.HOLD
    ) {
      this.logger.warn(
        `Booking ${bookingId} hold had expired when payment arrived — confirming anyway`,
      );
    }

    // ── Confirm in a transaction ─────────────────────────────────────────────
    await this.prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.CONFIRMED,
          paymentStatus: PaymentStatus.PAID,
        },
      });

      // Upsert the Payment record (may have been created by the mock flow)
      await tx.payment.upsert({
        where: { bookingId },
        update: {
          status: PaymentStatus.PAID,
          stripeId: session.id,
        },
        create: {
          bookingId,
          amount: booking.totalPrice,
          currency: 'vnd',
          status: PaymentStatus.PAID,
          stripeId: session.id,
        },
      });
    });

    this.logger.log(
      `Booking ${bookingId} confirmed via Stripe webhook [session=${session.id}]`,
    );
  }
}
