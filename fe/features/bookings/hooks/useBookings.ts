import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '../api/bookingsApi';
import { BookingStatus, CreateBookingInput } from '@/types/booking';

export function useMyBookings(page = 1) {
  return useQuery({
    queryKey: ['bookings', 'me', page],
    queryFn: () => bookingsApi.getMyBookings(page),
  });
}

export function useHostBookings(page = 1) {
  return useQuery({
    queryKey: ['bookings', 'host', page],
    queryFn: () => bookingsApi.getHostBookings(page),
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBookingInput) => bookingsApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      bookingsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
