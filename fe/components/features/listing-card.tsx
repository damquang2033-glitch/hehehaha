"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Bed, Bath, MapPin, ArrowRight } from "lucide-react";
import { Listing } from "@/types/listing";

interface ListingCardProps {
  listing: Listing;
}

const formatCurrency = (amount: string | number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(amount));
};

export function ListingCard({ listing }: ListingCardProps) {
  const firstImage = listing.images[0];

  return (
    <Card className="group overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 rounded-2xl bg-white dark:bg-slate-900 hover:-translate-y-2">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 flex items-center justify-center">
            <Bed className="h-16 w-16 text-orange-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/95 dark:bg-slate-900/95 text-orange-600 font-bold text-sm px-3 py-1.5 shadow-lg backdrop-blur-sm border-0 rounded-xl">
            {formatCurrency(listing.price)}/đêm
          </Badge>
        </div>
      </div>

      <CardContent className="p-5">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-orange-600 transition-colors duration-300 line-clamp-1">
          {listing.title}
        </h3>

        <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mb-3">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">{listing.location}</span>
        </div>

        {listing.description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {listing.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300 mb-5">
          {listing.maxGuests && (
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-orange-500/70" />
              <span>{listing.maxGuests} khách</span>
            </div>
          )}
          {listing.bedrooms != null && (
            <div className="flex items-center gap-1.5">
              <Bed className="h-4 w-4 text-orange-500/70" />
              <span>{listing.bedrooms} phòng ngủ</span>
            </div>
          )}
          {listing.bathrooms != null && (
            <div className="flex items-center gap-1.5">
              <Bath className="h-4 w-4 text-orange-500/70" />
              <span>{listing.bathrooms} WC</span>
            </div>
          )}
        </div>

        <Link href={`/listings/${listing.id}`} className="block">
          <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold shadow-md shadow-orange-500/15 hover:shadow-lg hover:shadow-orange-500/25 cursor-pointer transition-all duration-300 rounded-xl group/btn">
            Xem chi tiết & Đặt phòng
            <ArrowRight className="w-4 h-4 ml-1.5 group-hover/btn:translate-x-1 transition-transform duration-200" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
