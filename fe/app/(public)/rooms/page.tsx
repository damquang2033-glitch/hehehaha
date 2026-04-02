"use client";

import { useState, useMemo } from "react";
import { RoomTypeCard } from "@/components/features/room-type-card";
import { RoomFilters, RoomFilterValues } from "@/components/features/room-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BedDouble, Search, ChevronLeft, ChevronRight } from "lucide-react";

const MOCK_ROOMS = [
  {
    id: "1",
    name: "Phòng Deluxe Hướng Biển",
    description: "Phòng rộng rãi với tầm nhìn hướng biển tuyệt đẹp, được trang bị đầy đủ tiện nghi hiện đại.",
    basePrice: 2500000,
    capacity: 4,
    size: 45,
    bedType: "KING",
    amenities: JSON.stringify(["Wifi", "TV", "Điều hòa", "Minibar", "Ban công"]),
    images: [{ url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop", isPrimary: true }],
    isActive: true,
  },
  {
    id: "2",
    name: "Suite Hoàng Gia",
    description: "Suite sang trọng bậc nhất với phòng khách riêng biệt và dịch vụ butler cá nhân.",
    basePrice: 4500000,
    capacity: 6,
    size: 85,
    bedType: "KING",
    amenities: JSON.stringify(["Wifi", "TV", "Điều hòa", "Minibar", "Ban công", "Bồn tắm"]),
    images: [{ url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop", isPrimary: true }],
    isActive: true,
  },
  {
    id: "3",
    name: "Phòng Standard Hiện Đại",
    description: "Phòng tiêu chuẩn ấm cúng với thiết kế hiện đại, phù hợp cho các chuyến công tác.",
    basePrice: 1200000,
    capacity: 2,
    size: 28,
    bedType: "DOUBLE",
    amenities: JSON.stringify(["Wifi", "TV", "Điều hòa"]),
    images: [{ url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop", isPrimary: true }],
    isActive: true,
  },
  {
    id: "4",
    name: "Villa Bể Bơi Riêng",
    description: "Villa sang trọng với bể bơi riêng tư, vườn nhiệt đới và đầy đủ tiện nghi cao cấp.",
    basePrice: 8000000,
    capacity: 8,
    size: 200,
    bedType: "KING",
    amenities: JSON.stringify(["Wifi", "TV", "Điều hòa", "Minibar", "Ban công", "Bồn tắm", "Két sắt"]),
    images: [{ url: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&auto=format&fit=crop", isPrimary: true }],
    isActive: true,
  },
  {
    id: "5",
    name: "Phòng Twin Tiêu Chuẩn",
    description: "Phòng twin lý tưởng cho các cặp bạn bè hoặc anh em đi du lịch cùng nhau.",
    basePrice: 1500000,
    capacity: 2,
    size: 30,
    bedType: "TWIN",
    amenities: JSON.stringify(["Wifi", "TV", "Điều hòa", "Bàn làm việc"]),
    images: [{ url: "https://images.unsplash.com/photo-1631049421450-348ccd7f8949?w=800&auto=format&fit=crop", isPrimary: true }],
    isActive: true,
  },
  {
    id: "6",
    name: "Phòng Executive Hướng Núi",
    description: "Phòng executive cao cấp với tầm nhìn ra dãy núi hùng vĩ và khu vực làm việc riêng.",
    basePrice: 3200000,
    capacity: 3,
    size: 55,
    bedType: "QUEEN",
    amenities: JSON.stringify(["Wifi", "TV", "Điều hòa", "Minibar", "Bàn làm việc", "Két sắt"]),
    images: [{ url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&auto=format&fit=crop", isPrimary: true }],
    isActive: true,
  },
];

export default function RoomsPage() {
  const [filters, setFilters] = useState<RoomFilterValues>({
    priceRange: [0, 10000000],
    maxGuests: null,
    amenities: [],
  });

  const parseAmenities = (amenities: string[] | string | undefined): string[] => {
    if (!amenities) return [];
    try {
      if (typeof amenities === "string") {
        const parsed = JSON.parse(amenities);
        return Array.isArray(parsed) ? parsed : [];
      }
      return Array.isArray(amenities) ? amenities : [];
    } catch {
      return [];
    }
  };

  const filteredRoomTypes = useMemo(() => {
    return MOCK_ROOMS.filter((roomType) => {
      if (roomType.isActive === false) return false;
      if (roomType.basePrice < filters.priceRange[0] || roomType.basePrice > filters.priceRange[1]) return false;
      const guestCapacity = roomType.capacity || 0;
      if (filters.maxGuests && guestCapacity < filters.maxGuests) return false;
      if (filters.amenities.length > 0) {
        const roomAmenities = parseAmenities(roomType.amenities).map((a) => a.toLowerCase());
        const hasAllAmenities = filters.amenities.every((filterAmenity) =>
          roomAmenities.some((roomAmenity) => roomAmenity.includes(filterAmenity.toLowerCase()))
        );
        if (!hasAllAmenities) return false;
      }
      return true;
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Header */}
      <section className="relative py-16 bg-gradient-to-br from-orange-500 to-amber-500">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">
              Khám phá các loại phòng
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
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
            <RoomFilters onFilterChange={setFilters} maxPrice={10000000} />
          </div>

          {/* Room Types Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-orange-500" />
                <span className="text-slate-600 dark:text-slate-400">
                  {filteredRoomTypes.length} loại phòng
                </span>
              </div>
            </div>

            {/* Empty State */}
            {filteredRoomTypes.length === 0 && (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl shadow-lg">
                <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Không tìm thấy phòng phù hợp
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Hãy thử điều chỉnh bộ lọc để tìm kiếm kết quả khác
                </p>
              </div>
            )}

            {/* Room Types Grid */}
            {filteredRoomTypes.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRoomTypes.map((roomType) => (
                  <RoomTypeCard key={roomType.id} roomType={roomType} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
