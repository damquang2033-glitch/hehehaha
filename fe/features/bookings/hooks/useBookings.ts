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

export function useBooking(id: string) {
  return useQuery({
    queryKey: ['bookings', id],
    queryFn: () => bookingsApi.getById(id),
    enabled: !!id,
  });
}

export function useHoldBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBookingInput) => bookingsApi.hold(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

// kept for backward compat
export function useCreateBooking() {
  return useHoldBooking();
}

export function useFakePay() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingsApi.fakePay(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', id] });
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
