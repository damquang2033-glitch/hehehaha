export interface ReviewAuthor {
  id: string;
  name: string | null;
  avatar: string | null;
}

export interface Review {
  id: string;
  bookingId: string;
  guestId: string;
  guest: ReviewAuthor;
  listingId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  data: Review[];
  total: number;
  page: number;
  limit: number;
  avgRating: number;
}

export interface CreateReviewInput {
  bookingId: string;
  rating: number;
  comment: string;
}
