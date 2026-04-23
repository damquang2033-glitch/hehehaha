import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

// InstanceType trick: stripe v22 exports via `export = StripeConstructor`
// so `Stripe` here is the callable constructor, not the class.
// InstanceType<typeof Stripe> gives us the proper instance type.
export type StripeInstance = InstanceType<typeof Stripe>;
export type StripeEvent = ReturnType<StripeInstance['webhooks']['constructEvent']>;
export type StripeCheckoutSession = Awaited<
  ReturnType<StripeInstance['checkout']['sessions']['create']>
>;

@Injectable()
export class StripeProvider {
  readonly client: StripeInstance;
  private readonly logger = new Logger(StripeProvider.name);

  constructor(private readonly config: ConfigService) {
    this.client = new Stripe(config.getOrThrow<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2026-03-25.dahlia',
      typescript: true,
    });
    this.logger.log('Stripe client initialized');
  }

  async createCheckoutSession(
    params: Parameters<StripeInstance['checkout']['sessions']['create']>[0],
  ): Promise<StripeCheckoutSession> {
    return this.client.checkout.sessions.create(params);
  }

  constructWebhookEvent(
    rawBody: Buffer,
    signature: string,
    secret: string,
  ): StripeEvent {
    return this.client.webhooks.constructEvent(rawBody, signature, secret);
  }
}
