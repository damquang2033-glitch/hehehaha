import { IsBoolean, IsString } from 'class-validator';

// Mock webhook payload.
// In production: replace with Stripe's raw body + signature verification.
export class PaymentWebhookDto {
  @IsString()
  paymentIntentId!: string;

  @IsBoolean()
  success!: boolean;
}
