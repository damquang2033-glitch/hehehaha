"use client";

import { Star } from "lucide-react";
import { useListingReviews } from "../hooks/useReviews";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ReviewListProps {
  listingId: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-3.5 w-3.5",
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-100 text-slate-300"
          )}
        />
      ))}
    </div>
  );
}

export default function ReviewList({ listingId }: ReviewListProps) {
  const { data, isLoading } = useListingReviews(listingId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-200" />
              <div className="space-y-1.5">
                <div className="h-3 w-24 bg-slate-200 rounded" />
                <div className="h-3 w-16 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded" />
            <div className="h-3 w-3/4 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.total === 0) {
    return (
      <p className="text-slate-400 text-sm py-4">
        Chưa có đánh giá nào. Hãy là người đầu tiên!
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
        <span className="text-3xl font-bold text-slate-900">{data.avgRating.toFixed(1)}</span>
        <div>
          <StarRating rating={Math.round(data.avgRating)} />
          <p className="text-sm text-slate-500 mt-0.5">{data.total} đánh giá</p>
        </div>
      </div>

      {/* Review items */}
      {data.data.map((review) => (
        <div key={review.id} className="space-y-2 pb-5 border-b border-slate-100 last:border-0">
          <div className="flex items-center gap-3">
            {review.guest.avatar ? (
              <Image
                src={review.guest.avatar}
                alt={review.guest.name ?? "Guest"}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white font-bold text-sm">
                {(review.guest.name ?? "G")[0].toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold text-slate-800 text-sm">
                {review.guest.name ?? "Khách ẩn danh"}
              </p>
              <p className="text-xs text-slate-400">
                {new Date(review.createdAt).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </div>
            <div className="ml-auto">
              <StarRating rating={review.rating} />
            </div>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
