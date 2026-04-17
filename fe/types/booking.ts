import { Listing } from './listing';
import { User } from './auth';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

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
