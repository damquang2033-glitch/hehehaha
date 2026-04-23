"use client";

import { useRouter } from "next/navigation";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, LogIn, Clock } from "lucide-react";
import { Listing } from "@/types/listing";
import { useAuthStore } from "@/stores/authStore";
import { useHoldBooking } from "@/features/bookings/hooks/useBookings";
import Link from "next/link";

interface BookingCardProps {
  listing: Listing;
  isOwner: boolean;
}

const bookingSchema = z
  .object({
    checkIn: z.string().min(1, "Chọn ngày nhận phòng"),
    checkOut: z.string().min(1, "Chọn ngày trả phòng"),
    guestCount: z.string().refine((v) => Number(v) >= 1, "Tối thiểu 1 khách"),
  })
  .refine((d) => new Date(d.checkOut) > new Date(d.checkIn), {
    message: "Ngày trả phòng phải sau ngày nhận phòng",
    path: ["checkOut"],
  });

type BookingValues = z.infer<typeof bookingSchema>;

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);

const today = new Date().toISOString().split("T")[0];

export function BookingCard({ listing, isOwner }: BookingCardProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { mutate: holdBooking, isPending } = useHoldBooking();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema) as Resolver<BookingValues>,
    defaultValues: { checkIn: "", checkOut: "", guestCount: "1" },
  });

  const checkIn = watch("checkIn") as string;
  const checkOut = watch("checkOut") as string;

  const nights =
    checkIn && checkOut && new Date(checkOut) > new Date(checkIn)
      ? Math.ceil(
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
            86_400_000
        )
      : 0;

  const totalPrice = nights * Number(listing.price);

  const onSubmit = (values: BookingValues) => {
    holdBooking(
      {
        listingId: listing.id,
        checkIn: values.checkIn,
        checkOut: values.checkOut,
        guestCount: Number(values.guestCount),
      },
      {
        onSuccess: (booking) => {
          toast.success("Chỗ đã được giữ! Vui lòng thanh toán trong 5 phút.");
          router.push(`/bookings/${booking.id}/payment`);
        },
        onError: (err: unknown) => {
          const msg = (
            err as { response?: { data?: { message?: string } } }
          )?.response?.data?.message;
          toast.error(msg ?? "Không thể giữ chỗ. Vui lòng thử lại.");
        },
      }
    );
  };

  return (
    <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-lg p-6 space-y-5">
      <div>
        <span className="text-3xl font-bold text-slate-900 dark:text-white">
          {formatCurrency(Number(listing.price))}
        </span>
        <span className="text-slate-500 dark:text-slate-400 ml-1">/đêm</span>
      </div>

      {isOwner ? (
        <p className="text-sm text-slate-500 text-center py-2">
          Đây là chỗ ở của bạn
        </p>
      ) : !isAuthenticated ? (
        <div className="space-y-3">
          <p className="text-sm text-slate-500 text-center">
            Đăng nhập để đặt phòng
          </p>
          <Link href="/auth/login">
            <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl h-11">
              <LogIn className="h-4 w-4 mr-2" />
              Đăng nhập
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide text-slate-500">
                Nhận phòng
              </Label>
              <Input type="date" min={today} {...register("checkIn")} />
              {errors.checkIn && (
                <p className="text-xs text-red-500">{errors.checkIn.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide text-slate-500">
                Trả phòng
              </Label>
              <Input
                type="date"
                min={checkIn || today}
                {...register("checkOut")}
              />
              {errors.checkOut && (
                <p className="text-xs text-red-500">
                  {errors.checkOut.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-slate-500">
              Số khách
            </Label>
            <Input
              type="number"
              min={1}
              max={listing.maxGuests ?? undefined}
              {...register("guestCount")}
            />
            {errors.guestCount && (
              <p className="text-xs text-red-500">
                {errors.guestCount.message}
              </p>
            )}
            {listing.maxGuests && (
              <p className="text-xs text-slate-400">Tối đa {listing.maxGuests} khách</p>
            )}
          </div>

          {nights > 0 && (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>
                  {formatCurrency(Number(listing.price))} × {nights} đêm
                </span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700 pt-2">
                <span>Tổng</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold shadow-md shadow-orange-500/20 rounded-xl h-12 text-base"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Clock className="h-4 w-4 mr-2" />
            )}
            Giữ chỗ ngay
          </Button>

          <p className="text-xs text-slate-400 text-center">
            Chỗ sẽ được giữ trong 5 phút để bạn hoàn tất thanh toán
          </p>
        </form>
      )}
    </div>
  );
}
