"use client";

import Image from "next/image";
import Link from "next/link";
import { useMyBookings, useUpdateBookingStatus } from "@/features/bookings/hooks/useBookings";
import { Booking, BookingStatus } from "@/types/booking";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, CalendarDays, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";

const STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  CANCELLED: "Đã hủy",
  COMPLETED: "Hoàn thành",
};

const STATUS_COLOR: Record<BookingStatus, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  COMPLETED: "bg-slate-100 text-slate-600 border-slate-200",
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

const formatCurrency = (amount: string | number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(Number(amount));

function BookingItem({ booking }: { booking: Booking }) {
  const { mutate: updateStatus, isPending } = useUpdateBookingStatus();

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

  const canCancel = booking.status === "PENDING" || booking.status === "CONFIRMED";

  return (
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
            <Link href={`/listings/${booking.listingId}`} className="font-bold text-slate-900 dark:text-white hover:text-orange-600 transition-colors line-clamp-1">
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
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="font-bold text-orange-600">{formatCurrency(booking.totalPrice)}</span>
          {canCancel && (
            <Button variant="outline" size="sm" onClick={handleCancel} disabled={isPending}
              className="text-red-500 border-red-200 hover:bg-red-50">
              {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Hủy"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  const { data, isLoading } = useMyBookings();

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
          <Link href="/rooms"><Button variant="outline">Khám phá chỗ ở</Button></Link>
        </div>
      )}

      {!isLoading && data?.data.length ? (
        <div className="space-y-4">
          {data.data.map((booking) => <BookingItem key={booking.id} booking={booking} />)}
        </div>
      ) : null}
    </div>
  );
}
