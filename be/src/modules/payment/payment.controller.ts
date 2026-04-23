import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaymentService } from './payment.service';
import { CreateSessionDto } from './dto/create-session.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * POST /api/v1/payments/create-session
   *
   * Creates a Stripe Checkout Session for a HOLD booking.
   * Returns { sessionUrl } — the frontend redirects the user there.
   */
  @Post('create-session')
  @UseGuards(JwtAuthGuard)
  createSession(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateSessionDto,
  ) {
    return this.paymentService.createCheckoutSession(dto.bookingId, user.id);
  }

  /**
   * POST /api/v1/payments/webhook
   *
   * Receives Stripe events. No JwtAuthGuard — called by Stripe servers.
   * Stripe-Signature header is used instead of a JWT for verification.
   *
   * IMPORTANT: This endpoint requires the raw request body.
   * NestFactory must be created with { rawBody: true } in main.ts.
   */
  @Post('webhook')
  async handleWebhook(
    @Req() req: Request & { rawBody?: Buffer },
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = req.rawBody;
    if (!rawBody) {
      throw new BadRequestException(
        'Raw body is missing — ensure rawBody: true is set in NestFactory.create()',
      );
    }
    await this.paymentService.handleStripeWebhook(rawBody, signature);
    // Stripe expects a 2xx response. Body content is irrelevant to Stripe.
    return { received: true };
  }
}
