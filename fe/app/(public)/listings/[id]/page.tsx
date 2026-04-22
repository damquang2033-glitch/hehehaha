"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useListing } from "@/features/listings/hooks/useListings";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Users,
  Bed,
  Bath,
  ArrowLeft,
  Star,
  Pencil,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { BookingCard } from "@/features/bookings/components/BookingCard";
import ReviewList from "@/features/reviews/components/ReviewList";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ListingDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { data: listing, isLoading, isError } = useListing(id);

  if (isLoading) return <ListingDetailSkeleton />;

  if (isError || !listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500">Không tìm thấy chỗ ở này.</p>
        <Link href="/rooms">
          <Button variant="outline">Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  const images = listing.images.length > 0 ? listing.images : [];
  const hostInitial = listing.host.name?.[0]?.toUpperCase() ?? "H";
  const currentUser = useAuthStore((s) => s.user);
  const isOwner = currentUser?.id === listing.hostId;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back + Owner actions */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách
          </Link>
          {isOwner && (
            <Link href={`/host/listings/${id}/edit`}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Pencil className="h-3.5 w-3.5" />
                Chỉnh sửa
              </Button>
            </Link>
          )}
        </div>

        {/* Image gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-2xl overflow-hidden mb-8 h-80 md:h-96">
          {images[0] ? (
            <div className="relative col-span-1 md:col-span-1 row-span-2 h-full">
              <Image
                src={images[0]}
                alt={listing.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 flex items-center justify-center col-span-2 rounded-2xl">
              <Bed className="h-20 w-20 text-orange-300" />
            </div>
          )}
          {images.slice(1, 3).map((src, i) => (
            <div key={i} className="relative hidden md:block h-full">
              <Image src={src} alt={`${listing.title} ${i + 2}`} fill className="object-cover" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Location */}
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {listing.title}
              </h1>
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <MapPin className="h-4 w-4 shrink-0 text-orange-500" />
                <span>{listing.location}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4">
              {listing.maxGuests && (
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <Users className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-xs text-slate-500">Tối đa</p>
                    <p className="font-semibold text-slate-800 dark:text-white">{listing.maxGuests} khách</p>
                  </div>
                </div>
              )}
              {listing.bedrooms != null && (
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <Bed className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-xs text-slate-500">Phòng ngủ</p>
                    <p className="font-semibold text-slate-800 dark:text-white">{listing.bedrooms} phòng</p>
                  </div>
                </div>
              )}
              {listing.bathrooms != null && (
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <Bath className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-xs text-slate-500">Phòng tắm</p>
                    <p className="font-semibold text-slate-800 dark:text-white">{listing.bathrooms} phòng</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="font-bold text-lg text-slate-900 dark:text-white mb-3">Mô tả</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>

            {/* Host */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Chủ nhà</h2>
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={listing.host.avatar ?? undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-orange-400 to-amber-400 text-white text-lg font-semibold">
                    {hostInitial}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-lg">
                    {listing.host.name ?? "Chủ nhà"}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Star className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
                    <span>Chủ nhà đã được xác minh</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Đánh giá</h2>
              <ReviewList listingId={id} />
            </div>
          </div>

          {/* Right: Booking card */}
          <div className="lg:col-span-1">
            <BookingCard listing={listing} isOwner={isOwner} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ListingDetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Skeleton className="h-4 w-32 mb-6" />
        <Skeleton className="h-80 w-full rounded-2xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
            <div className="flex gap-3">
              <Skeleton className="h-16 w-28 rounded-xl" />
              <Skeleton className="h-16 w-28 rounded-xl" />
            </div>
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
          <div>
            <Skeleton className="h-72 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
