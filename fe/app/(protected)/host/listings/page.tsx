"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  BedDouble,
  MapPin,
  Users,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/authStore";
import { useListings } from "@/features/listings/hooks/useListings";
import { useDeleteListing } from "@/features/listings/hooks/useListingMutations";
import { Listing } from "@/types/listing";

const formatCurrency = (value: string | number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value));

function ListingRow({ listing }: { listing: Listing }) {
  const router = useRouter();
  const { mutate: deleteListing, isPending } = useDeleteListing();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    deleteListing(listing.id, {
      onSuccess: () => toast.success("Đã xóa chỗ ở."),
      onError: () => toast.error("Xóa thất bại. Vui lòng thử lại."),
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow">
      {/* Thumbnail */}
      <div className="relative w-full sm:w-44 h-36 shrink-0 bg-slate-100 dark:bg-slate-800">
        {listing.images[0] ? (
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BedDouble className="h-10 w-10 text-slate-300" />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge className="bg-white/90 text-slate-700 border-0 shadow-sm text-xs font-semibold">
            {listing.images.length} ảnh
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <Link
              href={`/listings/${listing.id}`}
              className="font-bold text-slate-900 dark:text-white hover:text-orange-600 transition-colors line-clamp-1 text-lg"
            >
              {listing.title}
            </Link>
            <span className="font-bold text-orange-600 shrink-0 text-base">
              {formatCurrency(listing.price)}
              <span className="text-xs font-normal text-slate-400">/đêm</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-orange-400" />
            <span className="line-clamp-1">{listing.location}</span>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            {listing.maxGuests && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {listing.maxGuests} khách
              </span>
            )}
            {listing.bedrooms != null && (
              <span className="flex items-center gap-1">
                <BedDouble className="h-3.5 w-3.5" />
                {listing.bedrooms} phòng ngủ
              </span>
            )}
            {listing.bathrooms != null && (
              <span className="flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 opacity-0" />
                {listing.bathrooms} phòng tắm
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            asChild
            className="gap-1.5 text-slate-700"
          >
            <Link href={`/host/listings/${listing.id}/edit`}>
              <Pencil className="h-3.5 w-3.5" />
              Chỉnh sửa
            </Link>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleDelete}
            disabled={isPending}
            className={
              confirmDelete
                ? "gap-1.5 border-red-500 bg-red-500 text-white hover:bg-red-600 hover:border-red-600"
                : "gap-1.5 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
            }
          >
            {isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            {confirmDelete ? "Nhấn lần nữa để xác nhận" : "Xóa"}
          </Button>

          <Button size="sm" variant="ghost" asChild className="ml-auto text-slate-500">
            <Link href={`/listings/${listing.id}`}>Xem trang →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function ListingRowSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col sm:flex-row">
      <Skeleton className="w-full sm:w-44 h-36 shrink-0 rounded-none" />
      <div className="flex-1 p-5 space-y-3">
        <div className="flex justify-between gap-4">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-2/5" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

const PAGE_SIZE = 8;

export default function HostListingsPage() {
  const user = useAuthStore((s) => s.user);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useListings(
    user ? { hostId: user.id, page, limit: PAGE_SIZE } : undefined
  );

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Chỗ ở của tôi
            </h1>
            {!isLoading && data && (
              <p className="text-sm text-slate-500 mt-0.5">
                {data.total} chỗ ở đang đăng
              </p>
            )}
          </div>
          <Button asChild className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 shadow-md shadow-orange-500/20">
            <Link href="/host/listings/new">
              <Plus className="h-4 w-4 mr-1.5" />
              Đăng chỗ ở mới
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-4">
        {/* Loading */}
        {isLoading && (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <ListingRowSkeleton key={i} />
            ))}
          </>
        )}

        {/* Empty state */}
        {!isLoading && data?.data.length === 0 && (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mx-auto mb-4">
              <BedDouble className="h-8 w-8 text-orange-400" />
            </div>
            <p className="font-semibold text-slate-700 dark:text-slate-300 text-lg mb-1">
              Bạn chưa có chỗ ở nào
            </p>
            <p className="text-slate-400 text-sm mb-6">
              Hãy đăng chỗ ở đầu tiên để bắt đầu nhận đặt phòng.
            </p>
            <Button asChild>
              <Link href="/host/listings/new">
                <Plus className="h-4 w-4 mr-1.5" />
                Đăng chỗ ở mới
              </Link>
            </Button>
          </div>
        )}

        {/* Listing list */}
        {!isLoading && data?.data.map((listing) => (
          <ListingRow key={listing.id} listing={listing} />
        ))}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-slate-600 dark:text-slate-400 px-2">
              Trang {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
