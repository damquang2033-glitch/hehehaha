import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/auth';
import { Listing, ListingQueryParams, ListingsResponse } from '@/types/listing';

export interface CreateListingInput {
  title: string;
  description: string;
  price: number;
  location: string;
  images?: string[];
  maxGuests?: number;
  bedrooms?: number;
  bathrooms?: number;
}

export type UpdateListingInput = Partial<CreateListingInput>;

export const listingsApi = {
  getAll: async (params?: ListingQueryParams) => {
    const { data } = await apiClient.get<ApiResponse<ListingsResponse>>(
      '/listings',
      { params }
    );
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Listing>>(`/listings/${id}`);
    return data.data;
  },

  create: async (input: CreateListingInput) => {
    const { data } = await apiClient.post<ApiResponse<Listing>>('/listings', input);
    return data.data;
  },

  update: async (id: string, input: UpdateListingInput) => {
    const { data } = await apiClient.patch<ApiResponse<Listing>>(`/listings/${id}`, input);
    return data.data;
  },

  remove: async (id: string) => {
    await apiClient.delete(`/listings/${id}`);
  },
};
