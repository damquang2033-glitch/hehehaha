import { Listing } from './listing';
import { User } from './auth';

export type BookingStatus =
  | 'HOLD'
  | 'PENDING'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'CANCELLED';

export type PaymentStatus = 'UNPAID' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface Payment {
  id: string;
  stripeId: string | null;
  amount: string;
  status: PaymentStatus;
}

export interface Booking {
  id: string;
  listingId: string;
  listing: Pick<Listing, 'id' | 'title' | 'location' | 'images' | 'price'>;
  guestId: string;
  guest: Pick<User, 'id' | 'name' | 'email' | 'avatar'>;
  checkIn: string;
  checkOut: string;
  totalPrice: string;
  guestCount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  holdUntil: string | null;
  payment: Payment | null;
  review: { id: string } | null;
  createdAt: string;
}

export interface BookingsResponse {
  data: Booking[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateBookingInput {
  listingId: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
}
