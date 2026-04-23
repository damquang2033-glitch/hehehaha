import { User } from './auth';

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  images: string[];
  maxGuests: number | null;
  bedrooms: number | null;
  beds: number | null;
  bathrooms: number | null;
  amenities: string[];
  propertyType: string | null;
  rentalType: string | null;
  structure: string | null;
  instantBooking: boolean;
  freeCancelBeforeHours: number;
  partialRefundPercent: number;
  hostId: string;
  host: Pick<User, 'id' | 'name' | 'avatar'> & { bio?: string | null };
  averageRating?: number | null;
  reviewCount?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListingsResponse {
  data: Listing[];
  total: number;
  page: number;
  limit: number;
}

export interface ListingQueryParams {
  page?: number;
  limit?: number;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minGuests?: number;
  hostId?: string;
}
