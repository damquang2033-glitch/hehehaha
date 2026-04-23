import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService], // needed by PaymentModule and TasksModule
})
export class BookingModule {}
