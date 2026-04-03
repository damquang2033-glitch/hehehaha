"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Maximize2, Bed, Wifi, Tv, Wind, Coffee, ArrowRight } from "lucide-react";

interface RoomImage {
  url: string;
  isPrimary?: boolean;
}

interface RoomType {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  capacity?: number;
  maxOccupancy?: number;
  size?: number;
  bedType: string;
  amenities?: string[] | string;
  images?: RoomImage[];
  isActive?: boolean;
}

interface RoomTypeCardProps {
  roomType: RoomType;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const getBedTypeLabel = (bedType: string) => {
  switch (bedType) {
    case "SINGLE":
      return "Giường đơn";
    case "DOUBLE":
      return "Giường đôi";
    case "QUEEN":
      return "Giường Queen";
    case "KING":
      return "Giường King";
    case "TWIN":
      return "2 Giường đơn";
    default:
      return bedType;
  }
};

const getAmenityIcon = (amenity: string) => {
  const lower = amenity.toLowerCase();
  if (lower.includes("wifi")) return <Wifi className="h-3.5 w-3.5" />;
  if (lower.includes("tv")) return <Tv className="h-3.5 w-3.5" />;
  if (lower.includes("ac") || lower.includes("điều hòa"))
    return <Wind className="h-3.5 w-3.5" />;
  if (lower.includes("coffee") || lower.includes("cà phê"))
    return <Coffee className="h-3.5 w-3.5" />;
  return null;
};

export function RoomTypeCard({ roomType }: RoomTypeCardProps) {
  const primaryImage =
    roomType.images?.find((img) => img.isPrimary) || roomType.images?.[0];

  let amenitiesArray: string[] = [];
  try {
    if (roomType.amenities) {
      amenitiesArray =
        typeof roomType.amenities === "string"
          ? JSON.parse(roomType.amenities)
          : roomType.amenities;
      if (!Array.isArray(amenitiesArray)) amenitiesArray = [];
    }
  } catch {
    amenitiesArray = [];
  }

  const displayedAmenities = amenitiesArray.slice(0, 4);
  const guestCount = roomType.capacity || roomType.maxOccupancy || 2;

  return (
    <Card className="group overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 rounded-2xl bg-white dark:bg-slate-900 hover:-translate-y-2">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={roomType.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 flex items-center justify-center">
            <Bed className="h-16 w-16 text-orange-300" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/95 dark:bg-slate-900/95 text-orange-600 font-bold text-sm px-3 py-1.5 shadow-lg backdrop-blur-sm border-0 rounded-xl">
            {formatCurrency(roomType.basePrice)}/đêm
          </Badge>
        </div>
      </div>

      <CardContent className="p-5">
        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-orange-600 transition-colors duration-300">
          {roomType.name}
        </h3>

        {/* Description */}
        {roomType.description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {roomType.description}
          </p>
        )}

        {/* Quick Info */}
        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300 mb-4">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-orange-500/70" />
            <span>{guestCount} khách</span>
          </div>
          {roomType.size && (
            <div className="flex items-center gap-1.5">
              <Maximize2 className="h-4 w-4 text-orange-500/70" />
              <span>{roomType.size} m&sup2;</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Bed className="h-4 w-4 text-orange-500/70" />
            <span>{getBedTypeLabel(roomType.bedType)}</span>
          </div>
        </div>

        {/* Amenities */}
        {displayedAmenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {displayedAmenities.map((amenity, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-normal text-xs rounded-lg border border-slate-100 dark:border-slate-700/50"
              >
                {getAmenityIcon(amenity)}
                <span className="ml-1">{amenity}</span>
              </Badge>
            ))}
            {amenitiesArray.length > 4 && (
              <Badge
                variant="secondary"
                className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-normal text-xs rounded-lg border border-slate-100 dark:border-slate-700/50"
              >
                +{amenitiesArray.length - 4}
              </Badge>
            )}
          </div>
        )}

        {/* Action Button */}
        <Link href={`/rooms/${roomType.id}`} className="block">
          <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold shadow-md shadow-orange-500/15 hover:shadow-lg hover:shadow-orange-500/25 cursor-pointer transition-all duration-300 rounded-xl group/btn">
            Xem chi tiết & Đặt phòng
            <ArrowRight className="w-4 h-4 ml-1.5 group-hover/btn:translate-x-1 transition-transform duration-200" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
