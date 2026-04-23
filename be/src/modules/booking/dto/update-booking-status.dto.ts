import { IsEnum } from 'class-validator';
import { BookingStatus } from '@prisma/client';

// Only statuses that users (guest/host) can manually request.
// HOLD and system-only statuses are excluded.
const MANUALLY_SETTABLE = [
  BookingStatus.CANCELLED,
  BookingStatus.CONFIRMED,
  BookingStatus.CHECKED_IN,
  BookingStatus.CHECKED_OUT,
] as const;

export type ManualBookingStatus = (typeof MANUALLY_SETTABLE)[number];

export class UpdateBookingStatusDto {
  @IsEnum(MANUALLY_SETTABLE, {
    message: `status must be one of: ${MANUALLY_SETTABLE.join(', ')}`,
  })
  status!: ManualBookingStatus;
}
