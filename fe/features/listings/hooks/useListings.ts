import { useQuery } from '@tanstack/react-query';
import { listingsApi } from '../api/listingsApi';
import { ListingQueryParams } from '@/types/listing';

export function useListings(params?: ListingQueryParams) {
  return useQuery({
    queryKey: ['listings', params],
    queryFn: () => listingsApi.getAll(params),
  });
}

export function useListing(id: string) {
  return useQuery({
    queryKey: ['listings', id],
    queryFn: () => listingsApi.getById(id),
    enabled: !!id,
  });
}
