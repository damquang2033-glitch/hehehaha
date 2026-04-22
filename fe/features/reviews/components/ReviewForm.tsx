"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { useCreateReview } from "../hooks/useReviews";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  bookingId: string;
  listingId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ bookingId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const createReview = useCreateReview();

  const canSubmit = rating >= 1 && comment.trim().length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReview.mutateAsync({ bookingId, rating, comment });
      toast.success("Cảm ơn bạn đã đánh giá!");
      onSuccess?.();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Gửi đánh giá thất bại.";
      toast.error(msg);
    }
  };

  const LABELS = ["", "Tệ", "Không tốt", "Bình thường", "Tốt", "Tuyệt vời"];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Star rating */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700">Đánh giá sao</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="p-0.5 transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  "h-8 w-8 transition-colors",
                  star <= (hovered || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-slate-100 text-slate-300"
                )}
              />
            </button>
          ))}
          {(hovered || rating) > 0 && (
            <span className="ml-2 text-sm font-medium text-amber-600">
              {LABELS[hovered || rating]}
            </span>
          )}
        </div>
      </div>

      {/* Comment */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700">
          Nhận xét của bạn
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Chia sẻ trải nghiệm của bạn về chỗ ở này... (tối thiểu 10 ký tự)"
          rows={4}
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-400 focus:outline-none resize-none text-slate-800 placeholder:text-slate-400 transition-colors"
        />
        <p className="text-xs text-slate-400 text-right">{comment.length} ký tự</p>
      </div>

      <button
        type="submit"
        disabled={!canSubmit || createReview.isPending}
        className={cn(
          "w-full py-3 rounded-xl font-semibold text-white transition-all duration-200",
          canSubmit && !createReview.isPending
            ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20"
            : "bg-slate-200 text-slate-400 cursor-not-allowed"
        )}
      >
        {createReview.isPending ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Đang gửi...
          </span>
        ) : (
          "Gửi đánh giá"
        )}
      </button>
    </form>
  );
}
