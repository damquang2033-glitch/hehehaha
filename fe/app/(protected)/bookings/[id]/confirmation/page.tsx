"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, CalendarDays, Users, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBooking } from "@/features/bookings/hooks/useBookings";

interface PageProps {
  params: Promise<{ id: string }>;
}

const formatCurrency = (amount: string | number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(amount));

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export default function ConfirmationPage({ params }: PageProps) {
  const { id } = use(params);
  const { data: booking, isLoading } = useBooking(id);

  if (isLoading) {
    return (
      <div className="container max-w-lg py-12 space-y-4">
        <Skeleton className="h-12 w-12 rounded-full mx-auto" />
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container max-w-lg py-12 text-center">
        <p className="text-slate-500">Không tìm thấy booking.</p>
        <Link href="/bookings">
          <Button variant="outline" className="mt-4">Về danh sách</Button>
        </Link>
      </div>
    );
  }

  const nights = Math.ceil(
    (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 86_400_000
  );

  const isConfirmed = booking.status === "CONFIRMED";

  return (
    <div className="container max-w-lg py-12">
      {/* Success icon + heading */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="flex flex-col items-center text-center mb-8"
      >
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-9 h-9 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {isConfirmed ? "Đặt phòng thành công!" : "Đặt phòng đang chờ xác nhận"}
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-xs">
          {isConfirmed
            ? "Chúc bạn có chuyến đi vui vẻ! Chi tiết đặt phòng được gửi qua email."
            : "Chủ nhà sẽ xác nhận trong thời gian sớm nhất."}
        </p>
      </motion.div>

      {/* Booking detail card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden mb-6"
      >
        <div className="relative w-full h-44">
          {booking.listing.images[0] ? (
            <Image
              src={booking.listing.images[0]}
              alt={booking.listing.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-50" />
          )}
        </div>
        <div className="p-5 space-y-3">
          <h2 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">
            {booking.listing.title}
          </h2>
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>{booking.listing.location}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-1">Nhận phòng</p>
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-orange-400 shrink-0" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {formatDate(booking.checkIn)}
                </span>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-1">Trả phòng</p>
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-orange-400 shrink-0" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {formatDate(booking.checkOut)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
            <Users className="h-4 w-4 text-orange-400" />
            <span>{booking.guestCount} khách · {nights} đêm</span>
          </div>
          <div className="flex justify-between font-bold text-base border-t border-slate-100 dark:border-slate-800 pt-3">
            <span className="text-slate-700 dark:text-slate-200">Tổng đã thanh toán</span>
            <span className="text-orange-600">{formatCurrency(booking.totalPrice)}</span>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="flex flex-col gap-3"
      >
        <Link href="/bookings">
          <Button className="w-full h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl">
            Xem đặt phòng của tôi
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
        <Link href="/rooms">
          <Button variant="outline" className="w-full h-12 rounded-xl">
            Khám phá thêm chỗ ở
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
