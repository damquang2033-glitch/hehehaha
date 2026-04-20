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
  bathrooms: number | null;
  hostId: string;
  host: Pick<User, 'id' | 'name' | 'avatar'>;
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
