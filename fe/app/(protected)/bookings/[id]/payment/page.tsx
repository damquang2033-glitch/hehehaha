"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Users,
  Clock,
  Loader2,
  AlertTriangle,
  CreditCard,
  MapPin,
} from "lucide-react";
import { useBooking, useInitiatePayment, useTriggerMockWebhook } from "@/features/bookings/hooks/useBookings";

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

function useCountdown(holdUntil: string | null) {
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    if (!holdUntil) return 0;
    return Math.max(0, Math.floor((new Date(holdUntil).getTime() - Date.now()) / 1000));
  });

  useEffect(() => {
    if (!holdUntil) return;
    const tick = setInterval(() => {
      setSecondsLeft(Math.max(0, Math.floor((new Date(holdUntil).getTime() - Date.now()) / 1000)));
    }, 1000);
    return () => clearInterval(tick);
  }, [holdUntil]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  return { secondsLeft, display: `${mins}:${secs.toString().padStart(2, "0")}` };
}

export default function PaymentPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: booking, isLoading, isError } = useBooking(id);
  const { mutate: initiatePayment, isPending: isInitiating } = useInitiatePayment();
  const { mutate: triggerWebhook, isPending: isWebhooking } = useTriggerMockWebhook();
  const [step, setStep] = useState<"review" | "paying">("review");

  const { secondsLeft, display } = useCountdown(booking?.holdUntil ?? null);
  const isExpired = secondsLeft === 0 && !!booking?.holdUntil;
  const isPaying = isInitiating || isWebhooking;

  // Redirect away if booking is not in HOLD state
  useEffect(() => {
    if (!booking) return;
    if (booking.status === "CONFIRMED" || booking.status === "PENDING") {
      router.replace(`/bookings/${id}/confirmation`);
    }
    if (booking.status === "CANCELLED") {
      toast.error("Booking đã bị hủy.");
      router.replace("/bookings");
    }
  }, [booking, id, router]);

  const handlePay = () => {
    setStep("paying");
    initiatePayment(id, {
      onSuccess: (updatedBooking) => {
        const paymentIntentId = updatedBooking.payment?.stripeId;
        if (!paymentIntentId) {
          toast.error("Lỗi khởi tạo thanh toán.");
          setStep("review");
          return;
        }
        triggerWebhook(paymentIntentId, {
          onSuccess: () => {
            toast.success("Thanh toán thành công!");
            router.push(`/bookings/${id}/confirmation`);
          },
          onError: () => {
            toast.error("Xác nhận thanh toán thất bại.");
            setStep("review");
          },
        });
      },
      onError: (err: unknown) => {
        const msg = (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message;
        toast.error(msg ?? "Khởi tạo thanh toán thất bại.");
        setStep("review");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="container max-w-lg py-12 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !booking) {
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

  return (
    <div className="container max-w-lg py-10">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Xác nhận & Thanh toán</h1>
      <p className="text-sm text-slate-500 mb-8">Hoàn tất thanh toán để xác nhận đặt phòng của bạn.</p>

      {/* Hold countdown */}
      <div
        className={`flex items-center gap-3 rounded-xl px-4 py-3 mb-6 text-sm font-medium ${
          isExpired
            ? "bg-red-50 text-red-700 border border-red-200"
            : secondsLeft < 60
            ? "bg-orange-50 text-orange-700 border border-orange-200"
            : "bg-amber-50 text-amber-700 border border-amber-200"
        }`}
      >
        {isExpired ? (
          <AlertTriangle className="h-4 w-4 shrink-0" />
        ) : (
          <Clock className="h-4 w-4 shrink-0" />
        )}
        {isExpired ? (
          <span>Chỗ giữ đã hết hạn. <Link href={`/listings/${booking.listingId}`} className="underline">Thử lại</Link></span>
        ) : (
          <span>Chỗ được giữ trong <strong>{display}</strong> — hoàn tất trước khi hết giờ</span>
        )}
      </div>

      {/* Booking summary card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden mb-6">
        <div className="relative w-full h-48">
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
          <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300 pt-1">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-orange-400" />
              <span>{formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-orange-400" />
              <span>{booking.guestCount} khách</span>
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>{formatCurrency(booking.listing.price)} × {nights} đêm</span>
              <span>{formatCurrency(booking.totalPrice)}</span>
            </div>
            <div className="flex justify-between font-bold text-base text-slate-900 dark:text-white">
              <span>Tổng cộng</span>
              <span className="text-orange-600">{formatCurrency(booking.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment button */}
      <Button
        onClick={handlePay}
        disabled={isPaying || isExpired || step === "paying"}
        className="w-full h-14 text-base font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/20 rounded-xl"
      >
        {isPaying ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Đang xử lý...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5 mr-2" />
            Thanh toán {formatCurrency(booking.totalPrice)}
          </>
        )}
      </Button>

      <p className="text-xs text-slate-400 text-center mt-3">
        Thanh toán demo — không trừ tiền thật
      </p>
    </div>
  );
}
