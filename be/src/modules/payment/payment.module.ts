import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { StripeProvider } from './stripe.provider';

@Module({
  controllers: [PaymentController],
  // PrismaModule is @Global() — no explicit import needed
  providers: [PaymentService, StripeProvider],
  exports: [PaymentService],
})
export class PaymentModule {}
