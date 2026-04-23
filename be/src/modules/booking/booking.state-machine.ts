import { ForbiddenException } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';

export type BookingActor = 'guest' | 'host' | 'system';

/**
 * Allowed transitions per actor.
 *
 * System transitions are used internally (payment webhook, cron expiry, check-out).
 * Guest and host transitions map to what each role can manually trigger.
 */
const TRANSITIONS: Record<
  BookingActor,
  Partial<Record<BookingStatus, BookingStatus[]>>
> = {
  system: {
    [BookingStatus.HOLD]: [BookingStatus.PENDING, BookingStatus.CANCELLED],
    [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
    [BookingStatus.CONFIRMED]: [
      BookingStatus.CHECKED_IN,
      BookingStatus.CANCELLED,
    ],
    [BookingStatus.CHECKED_IN]: [BookingStatus.CHECKED_OUT],
  },
  guest: {
    [BookingStatus.HOLD]: [BookingStatus.CANCELLED],
    [BookingStatus.PENDING]: [BookingStatus.CANCELLED],
    [BookingStatus.CONFIRMED]: [BookingStatus.CANCELLED],
  },
  host: {
    [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
    [BookingStatus.CONFIRMED]: [
      BookingStatus.CHECKED_IN,
      BookingStatus.CANCELLED,
    ],
    [BookingStatus.CHECKED_IN]: [BookingStatus.CHECKED_OUT],
  },
};

export function canTransition(
  from: BookingStatus,
  to: BookingStatus,
  actor: BookingActor,
): boolean {
  return TRANSITIONS[actor][from]?.includes(to) ?? false;
}

export function assertTransition(
  from: BookingStatus,
  to: BookingStatus,
  actor: BookingActor,
): void {
  if (!canTransition(from, to, actor)) {
    throw new ForbiddenException(
      `Không thể chuyển trạng thái từ [${from}] → [${to}] với vai trò "${actor}"`,
    );
  }
}

// Statuses that block a new booking from being created for overlapping dates
export const BLOCKING_STATUSES: BookingStatus[] = [
  BookingStatus.PENDING,
  BookingStatus.CONFIRMED,
  BookingStatus.CHECKED_IN,
];
