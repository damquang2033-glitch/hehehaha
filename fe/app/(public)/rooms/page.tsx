"use client";

import { useState, useMemo } from "react";
import { RoomTypeCard } from "@/components/features/room-type-card";
import { RoomFilters, RoomFilterValues } from "@/components/features/room-filters";
import { Button } from "@/components/ui/button";
import { BedDouble, Search, Sparkles } from "lucide-react";

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
      <section className="relative py-20 bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/5" />
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Đa dạng lựa chọn
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-md tracking-tight">
              Khám phá các loại phòng
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
            <RoomFilters onFilterChange={setFilters} maxPrice={10000000} />
          </div>

          {/* Room Types Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 flex items-center justify-center">
                  <BedDouble className="h-5 w-5 text-orange-500" />
                </div>
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  {filteredRoomTypes.length} loại phòng
                </span>
              </div>
            </div>

            {/* Empty State */}
            {filteredRoomTypes.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-5">
                  <Search className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Không tìm thấy phòng phù hợp
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
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
