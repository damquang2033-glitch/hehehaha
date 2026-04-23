import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentWebhookDto } from './dto/payment-webhook.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * POST /api/v1/payments/webhook
   *
   * No JwtAuthGuard — this endpoint is called by the payment provider (Stripe).
   * In production: verify the webhook signature instead of accepting raw JSON.
   *
   * Stripe example:
   *   @Headers('stripe-signature') sig: string
   *   @RawBody() rawBody: Buffer  ← needs NestJS rawBody option enabled in main.ts
   *   const event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
   */
  @Post('webhook')
  handleWebhook(@Body() dto: PaymentWebhookDto) {
    return this.paymentService.handleWebhook(dto.paymentIntentId, dto.success);
  }
}
