import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BookingService } from '../modules/booking/booking.service';

@Injectable()
export class BookingTasksService {
  private readonly logger = new Logger(BookingTasksService.name);

  constructor(private readonly bookingService: BookingService) {}

  /**
   * Runs every minute.
   * Finds all HOLD bookings where holdUntil < now and sets them to CANCELLED.
   * This guarantees held slots are freed even if the user never explicitly cancels.
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async expireStaleHolds() {
    const count = await this.bookingService.expireStaleHolds();
    if (count > 0) {
      this.logger.log(`Expired ${count} stale HOLD booking(s)`);
    }
  }
}
