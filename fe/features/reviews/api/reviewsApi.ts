import { apiClient } from "@/lib/apiClient";
import { ApiResponse } from "@/types/auth";
import { CreateReviewInput, Review, ReviewsResponse } from "@/types/review";

export const reviewsApi = {
  create: async (input: CreateReviewInput) => {
    const { data } = await apiClient.post<ApiResponse<Review>>("/reviews", input);
    return data.data;
  },

  getByListing: async (listingId: string, page = 1, limit = 10) => {
    const { data } = await apiClient.get<ApiResponse<ReviewsResponse>>(
      `/listings/${listingId}/reviews`,
      { params: { page, limit } }
    );
    return data.data;
  },

  getMyReviews: async (page = 1, limit = 10) => {
    const { data } = await apiClient.get<ApiResponse<ReviewsResponse>>(
      "/reviews/me",
      { params: { page, limit } }
    );
    return data.data;
  },
};
