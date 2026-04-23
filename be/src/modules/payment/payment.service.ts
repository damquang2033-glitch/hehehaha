import { Injectable, Logger } from '@nestjs/common';
import { BookingService } from '../booking/booking.service';

/**
 * PaymentService acts as the bridge between the payment provider and BookingService.
 *
 * Currently uses a mock implementation.
 * To integrate Stripe:
 *   1. npm install stripe
 *   2. Replace createPaymentIntent() with stripe.paymentIntents.create()
 *   3. Replace handleWebhook() with stripe.webhooks.constructEvent() + signature verification
 */
@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(private readonly bookingService: BookingService) {}

  /**
   * Called by webhook endpoint (POST /payments/webhook).
   * Delegates to BookingService which owns the booking state machine.
   */
  async handleWebhook(paymentIntentId: string, success: boolean) {
    this.logger.log(
      `Webhook received: paymentIntentId=${paymentIntentId} success=${success}`,
    );
    return this.bookingService.handlePaymentWebhook(paymentIntentId, success);
  }

  // ── Stripe integration template ───────────────────────────────────────────
  //
  // async createStripeIntent(amount: number, currency: string, metadata: Record<string, string>) {
  //   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });
  //   return stripe.paymentIntents.create({ amount, currency, metadata });
  // }
  //
  // async verifyStripeWebhook(rawBody: Buffer, signature: string) {
  //   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });
  //   return stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  // }
}
