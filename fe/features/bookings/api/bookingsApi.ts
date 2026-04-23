import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/auth';
import { Booking, BookingsResponse, BookingStatus, CreateBookingInput } from '@/types/booking';

export const bookingsApi = {
  hold: async (input: CreateBookingInput) => {
    const { data } = await apiClient.post<ApiResponse<Booking>>('/bookings', input);
    return data.data!;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return data.data!;
  },

  getMyBookings: async (page = 1, limit = 10) => {
    const { data } = await apiClient.get<ApiResponse<BookingsResponse>>('/bookings/me', {
      params: { page, limit },
    });
    return data.data!;
  },

  getHostBookings: async (page = 1, limit = 10) => {
    const { data } = await apiClient.get<ApiResponse<BookingsResponse>>('/bookings/host', {
      params: { page, limit },
    });
    return data.data!;
  },

  initiatePayment: async (id: string) => {
    const { data } = await apiClient.post<ApiResponse<Booking>>(`/bookings/${id}/pay`);
    return data.data!;
  },

  triggerMockWebhook: async (paymentIntentId: string) => {
    const { data } = await apiClient.post<ApiResponse<Booking>>('/payments/webhook', {
      paymentIntentId,
      success: true,
    });
    return data.data!;
  },

  updateStatus: async (id: string, status: BookingStatus) => {
    const { data } = await apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}/status`, { status });
    return data.data!;
  },

  // kept for backward compat
  create: async (input: CreateBookingInput) => bookingsApi.hold(input),
};
