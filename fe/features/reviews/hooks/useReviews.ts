import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewsApi } from "../api/reviewsApi";
import { CreateReviewInput } from "@/types/review";

export function useListingReviews(listingId: string, page = 1) {
  return useQuery({
    queryKey: ["reviews", "listing", listingId, page],
    queryFn: () => reviewsApi.getByListing(listingId, page),
    enabled: !!listingId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateReviewInput) => reviewsApi.create(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", "listing", data?.listingId] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
