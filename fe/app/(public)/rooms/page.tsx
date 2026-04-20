"use client";

import { useState, useCallback } from "react";
import { ListingCard } from "@/components/features/listing-card";
import { RoomFilters, RoomFilterValues } from "@/components/features/room-filters";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BedDouble, Search, Sparkles } from "lucide-react";
import { useListings } from "@/features/listings/hooks/useListings";
import { ListingQueryParams } from "@/types/listing";

const MAX_PRICE = 50000000;

export default function RoomsPage() {
  const [queryParams, setQueryParams] = useState<ListingQueryParams>({ limit: 50 });

  const { data, isLoading, isError } = useListings(queryParams);

  const handleFilterChange = useCallback((filters: RoomFilterValues) => {
    setQueryParams({
      limit: 50,
      minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
      maxPrice: filters.priceRange[1] < MAX_PRICE ? filters.priceRange[1] : undefined,
      minGuests: filters.maxGuests ?? undefined,
    });
  }, []);

  const listings = data?.data ?? [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Header */}
      <section className="relative py-20 bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/5" />
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Đa dạng lựa chọn
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-md tracking-tight">
              Khám phá các chỗ ở
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              Lựa chọn không gian nghỉ ngơi hoàn hảo cho kỳ nghỉ của bạn
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <RoomFilters onFilterChange={handleFilterChange} maxPrice={MAX_PRICE} />
          </div>

          {/* Listings Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 flex items-center justify-center">
                  <BedDouble className="h-5 w-5 text-orange-500" />
                </div>
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  {isLoading ? "Đang tải..." : `${listings.length} chỗ ở`}
                </span>
              </div>
            </div>

            {/* Loading skeleton */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
                    <Skeleton className="h-56 w-full" />
                    <div className="p-5 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-10 w-full mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error state */}
            {isError && (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <p className="text-slate-500">Không thể tải danh sách. Vui lòng thử lại.</p>
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                  Thử lại
                </Button>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !isError && listings.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-5">
                  <Search className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Không tìm thấy chỗ ở phù hợp
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Hãy thử điều chỉnh bộ lọc để tìm kiếm kết quả khác
                </p>
              </div>
            )}

            {/* Listings grid */}
            {!isLoading && listings.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
