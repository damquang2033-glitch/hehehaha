"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useMyBookings, useUpdateBookingStatus } from "@/features/bookings/hooks/useBookings";
import { Booking, BookingStatus } from "@/types/booking";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, CalendarDays, Users, Loader2, Star, X, Clock, AlertTriangle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import ReviewForm from "@/features/reviews/components/ReviewForm";

const STATUS_LABEL: Record<BookingStatus, string> = {
  HOLD: "Đang giữ chỗ",
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  CHECKED_IN: "Đang ở",
  CHECKED_OUT: "Đã trả phòng",
  CANCELLED: "Đã hủy",
};

const STATUS_COLOR: Record<BookingStatus, string> = {
  HOLD: "bg-blue-50 text-blue-700 border-blue-200",
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-green-50 text-green-700 border-green-200",
  CHECKED_IN: "bg-teal-50 text-teal-700 border-teal-200",
  CHECKED_OUT: "bg-slate-100 text-slate-600 border-slate-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

const formatCurrency = (amount: string | number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(Number(amount));

function HoldCountdown({ holdUntil, bookingId }: { holdUntil: string; bookingId: string }) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, Math.floor((new Date(holdUntil).getTime() - Date.now()) / 1000))
  );

  useEffect(() => {
    const tick = setInterval(() => {
      setSecondsLeft(Math.max(0, Math.floor((new Date(holdUntil).getTime() - Date.now()) / 1000)));
    }, 1000);
    return () => clearInterval(tick);
  }, [holdUntil]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const isExpired = secondsLeft === 0;

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-1.5 border border-red-200">
        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
        <span>Chỗ giữ đã hết hạn</span>
      </div>
    );
  }

  return (
    <Link href={`/bookings/${bookingId}/payment`}>
      <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 rounded-lg px-3 py-1.5 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer">
        <Clock className="h-3.5 w-3.5 shrink-0" />
        <span>
          Còn <strong>{mins}:{secs.toString().padStart(2, "0")}</strong> để thanh toán
        </span>
        <ArrowRight className="h-3 w-3 ml-auto" />
      </div>
    </Link>
  );
}

function ReviewModal({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="h-4 w-4 text-slate-500" />
        </button>
        <h3 className="font-bold text-xl text-slate-900 mb-1">Viết đánh giá</h3>
        <p className="text-sm text-slate-500 mb-5 line-clamp-1">{booking.listing.title}</p>
        <ReviewForm bookingId={booking.id} listingId={booking.listingId} onSuccess={onClose} />
      </div>
    </div>
  );
}

function BookingItem({ booking }: { booking: Booking }) {
  const { mutate: updateStatus, isPending } = useUpdateBookingStatus();
  const [showReviewModal, setShowReviewModal] = useState(false);

  const handleCancel = () => {
    if (!confirm("Bạn có chắc muốn hủy đặt phòng này?")) return;
    updateStatus(
      { id: booking.id, status: "CANCELLED" },
      {
        onSuccess: () => toast.success("Đã hủy đặt phòng"),
        onError: () => toast.error("Hủy thất bại"),
      }
    );
  };

  const canCancel = booking.status === "PENDING" || booking.status === "CONFIRMED" || booking.status === "HOLD";
  const canReview = booking.status === "CHECKED_OUT" && !booking.review;
  const isHold = booking.status === "HOLD";

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-40 h-40 shrink-0">
          {booking.listing.images[0] ? (
            <Image src={booking.listing.images[0]} alt={booking.listing.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/10" />
          )}
        </div>
        <div className="p-5 flex flex-col justify-between flex-1">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <Link
                href={`/listings/${booking.listingId}`}
                className="font-bold text-slate-900 dark:text-white hover:text-orange-600 transition-colors line-clamp-1"
              >
                {booking.listing.title}
              </Link>
              <Badge className={`shrink-0 text-xs border ${STATUS_COLOR[booking.status]}`}>
                {STATUS_LABEL[booking.status]}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-1">{booking.listing.location}</span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-orange-500/70" />
                <span>{formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-orange-500/70" />
                <span>{booking.guestCount} khách</span>
              </div>
            </div>

            {/* HOLD countdown inline */}
            {isHold && booking.holdUntil && (
              <HoldCountdown holdUntil={booking.holdUntil} bookingId={booking.id} />
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="font-bold text-orange-600">{formatCurrency(booking.totalPrice)}</span>
            <div className="flex items-center gap-2">
              {isHold && (
                <Link href={`/bookings/${booking.id}/payment`}>
                  <Button size="sm" className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 gap-1.5">
                    Thanh toán ngay
                  </Button>
                </Link>
              )}
              {canReview && (
                <Button
                  size="sm"
                  onClick={() => setShowReviewModal(true)}
                  className="gap-1.5 bg-amber-500 hover:bg-amber-600 text-white border-0"
                >
                  <Star className="h-3.5 w-3.5" />
                  Đánh giá
                </Button>
              )}
              {booking.status === "CHECKED_OUT" && booking.review && (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  Đã đánh giá
                </span>
              )}
              {canCancel && !isHold && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isPending}
                  className="text-red-500 border-red-200 hover:bg-red-50"
                >
                  {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Hủy"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showReviewModal && (
        <ReviewModal booking={booking} onClose={() => setShowReviewModal(false)} />
      )}
    </>
  );
}

export default function MyBookingsPage() {
  const { data, isLoading } = useMyBookings();

  const holdBookings = data?.data.filter((b) => b.status === "HOLD") ?? [];
  const otherBookings = data?.data.filter((b) => b.status !== "HOLD") ?? [];

  return (
    <div className="container max-w-3xl py-10">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Đặt phòng của tôi</h1>

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}
        </div>
      )}

      {!isLoading && !data?.data.length && (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
          <p className="text-slate-500 mb-4">Bạn chưa có đặt phòng nào</p>
          <Link href="/rooms">
            <Button variant="outline">Khám phá chỗ ở</Button>
          </Link>
        </div>
      )}

      {!isLoading && data?.data.length ? (
        <div className="space-y-4">
          {/* HOLD bookings first */}
          {holdBookings.map((booking) => <BookingItem key={booking.id} booking={booking} />)}
          {/* Rest */}
          {otherBookings.map((booking) => <BookingItem key={booking.id} booking={booking} />)}
        </div>
      ) : null}
    </div>
  );
}
