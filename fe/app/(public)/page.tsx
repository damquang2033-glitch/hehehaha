"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchBar } from "@/components/features/search-bar";
import { DestinationCard } from "@/components/features/destination-card";
import { TestimonialCard } from "@/components/features/testimonial-card";
import { AmenityIcon } from "@/components/features/amenity-icon";
import { NewsletterForm } from "@/components/features/newsletter-form";
import {
  Shield,
  Star,
  Clock,
  Headphones,
  Wifi,
  Car,
  UtensilsCrossed,
  Dumbbell,
  Sparkles,
  Coffee,
  Waves,
  ConciergeBell,
  MapPin,
  Bed,
  Bath,
  Users,
  ArrowRight,
  ChevronRight,
  Heart,
} from "lucide-react";

const FEATURES = [
  {
    icon: Shield,
    title: "Đảm bảo giá tốt nhất",
    description:
      "Cam kết giá tốt nhất thị trường, hoàn tiền nếu tìm thấy giá rẻ hơn.",
  },
  {
    icon: Star,
    title: "Phòng chất lượng cao",
    description:
      "Tất cả phòng được kiểm tra kỹ lưỡng, đảm bảo sạch sẽ và tiện nghi.",
  },
  {
    icon: Clock,
    title: "Đặt phòng tức thì",
    description: "Xác nhận đặt phòng ngay lập tức, không cần chờ đợi.",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ 24/7",
    description: "Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn mọi lúc.",
  },
];

const DESTINATIONS = [
  {
    name: "Đà Nẵng",
    image:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&auto=format&fit=crop",
    properties: 120,
    featured: true,
  },
  {
    name: "Hội An",
    image:
      "https://images.unsplash.com/photo-1536323760109-ca8c07450053?w=800&auto=format&fit=crop",
    properties: 85,
    featured: false,
  },
  {
    name: "Nha Trang",
    image:
      "https://images.unsplash.com/photo-1573790387438-4da905039392?w=800&auto=format&fit=crop",
    properties: 95,
    featured: true,
  },
  {
    name: "Phú Quốc",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&auto=format&fit=crop",
    properties: 78,
    featured: false,
  },
  {
    name: "Hà Nội",
    image:
      "https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=800&auto=format&fit=crop",
    properties: 150,
    featured: false,
  },
  {
    name: "Sapa",
    image:
      "https://images.unsplash.com/photo-1584003564911-a5e0e9a89f63?w=800&auto=format&fit=crop",
    properties: 45,
    featured: false,
  },
];

const FEATURED_ROOMS = [
  {
    name: "Phòng Deluxe Hướng Biển",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop",
    price: 2500000,
    rating: 4.9,
    reviews: 234,
    beds: 2,
    baths: 1,
    guests: 4,
  },
  {
    name: "Suite Hoàng Gia",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop",
    price: 4500000,
    rating: 5.0,
    reviews: 156,
    beds: 3,
    baths: 2,
    guests: 6,
  },
  {
    name: "Phòng Standard Hiện Đại",
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop",
    price: 1200000,
    rating: 4.7,
    reviews: 412,
    beds: 1,
    baths: 1,
    guests: 2,
  },
  {
    name: "Villa Bể Bơi Riêng",
    image:
      "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&auto=format&fit=crop",
    price: 8000000,
    rating: 4.9,
    reviews: 89,
    beds: 4,
    baths: 3,
    guests: 8,
  },
];

const TESTIMONIALS = [
  {
    name: "Nguyễn Minh Anh",
    location: "Hà Nội",
    rating: 5,
    comment:
      "Dịch vụ tuyệt vời, phòng sạch sẽ và view đẹp. Nhân viên rất nhiệt tình và chu đáo. Chắc chắn sẽ quay lại!",
    date: "12/2025",
  },
  {
    name: "Trần Văn Hoàng",
    location: "TP. Hồ Chí Minh",
    rating: 5,
    comment:
      "Đặt phòng qua Stayzy rất nhanh và tiện lợi. Giá cả hợp lý, phòng đúng như mô tả. Rất hài lòng!",
    date: "11/2025",
  },
  {
    name: "Lê Thị Hương",
    location: "Đà Nẵng",
    rating: 4,
    comment:
      "Trải nghiệm nghỉ dưỡng tuyệt vời cho gia đình. Tiện nghi đầy đủ, đồ ăn ngon. Recommend cho mọi người!",
    date: "01/2026",
  },
];

const AMENITIES = [
  { icon: Wifi, label: "WiFi miễn phí", description: "Tốc độ cao" },
  { icon: Car, label: "Đỗ xe miễn phí", description: "An toàn 24/7" },
  { icon: UtensilsCrossed, label: "Nhà hàng", description: "Ẩm thực đa dạng" },
  { icon: Dumbbell, label: "Phòng gym", description: "Thiết bị hiện đại" },
  { icon: Waves, label: "Hồ bơi", description: "Nước nóng/lạnh" },
  { icon: Sparkles, label: "Spa & Massage", description: "Thư giãn tuyệt đối" },
  { icon: Coffee, label: "Quầy bar", description: "Đồ uống cao cấp" },
  { icon: ConciergeBell, label: "Dịch vụ phòng", description: "Phục vụ 24/7" },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-[92vh] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2670&auto=format&fit=crop")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: "3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-3xl" />

        {/* Hero Content */}
        <div className="relative z-10 w-full container mx-auto px-4 flex flex-col items-center gap-8">
          {/* Badge */}
          <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm animate-fade-in-up shadow-lg">
            <Sparkles className="w-4 h-4 mr-2 text-amber-400" />
            Khám phá những kỳ nghỉ tuyệt vời
          </div>

          {/* Main Heading */}
          <div className="text-center space-y-5 max-w-4xl animate-fade-in-up stagger-1" style={{ opacity: 0 }}>
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold text-white tracking-tight leading-[1.1]">
              Trải nghiệm kỳ nghỉ{" "}
              <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
                hoàn hảo
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/85 font-light max-w-2xl mx-auto leading-relaxed">
              Khám phá những phòng nghỉ sang trọng, tiện nghi đẳng cấp và dịch
              vụ tận tâm tại Stayzy.
            </p>
          </div>

          {/* Floating Search Bar */}
          <div className="w-full max-w-4xl mt-2 animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
            <SearchBar />
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-8 animate-fade-in-up stagger-3" style={{ opacity: 0 }}>
            {[
              { value: "50+", label: "Phòng đẳng cấp" },
              { value: "4.9", label: "Đánh giá trung bình" },
              { value: "10k+", label: "Khách hài lòng" },
              { value: "24/7", label: "Hỗ trợ khách hàng" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center group cursor-default">
                <p className="text-3xl md:text-5xl font-bold text-white group-hover:text-orange-400 transition-colors duration-300">
                  {stat.value}
                </p>
                <p className="text-white/60 text-sm mt-1.5 font-medium tracking-wide uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-7 h-11 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-slate-900 to-transparent z-10" />
      </section>

      {/* ==================== POPULAR DESTINATIONS SECTION ==================== */}
      <section className="py-24 bg-white dark:bg-slate-900 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
            <div className="space-y-3">
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 tracking-wide uppercase">
                <MapPin className="w-3.5 h-3.5 mr-1.5" />
                Điểm đến phổ biến
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                Khám phá{" "}
                <span className="text-gradient">Việt Nam</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-lg text-lg">
                Những điểm đến được yêu thích nhất với hàng nghìn lựa chọn
                khách sạn chất lượng.
              </p>
            </div>
            <Link href="/destinations" className="group">
              <Button
                variant="ghost"
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20 cursor-pointer text-base"
              >
                Xem tất cả
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Improved grid layout - first 2 items larger */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-4 auto-rows-[280px]">
            {DESTINATIONS.map((destination, index) => (
              <DestinationCard
                key={index}
                {...destination}
                className={
                  index === 0
                    ? "lg:col-span-4 lg:row-span-2 md:col-span-2"
                    : index === 1
                      ? "lg:col-span-4 lg:row-span-2 md:col-span-2"
                      : "lg:col-span-4 md:col-span-2"
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURED ROOMS SECTION ==================== */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
        {/* Decorative bg */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl translate-y-1/2" />

        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
            <div className="space-y-3">
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 tracking-wide uppercase">
                <Star className="w-3.5 h-3.5 mr-1.5" />
                Phòng nổi bật
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                Phòng được{" "}
                <span className="text-gradient">yêu thích</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-lg text-lg">
                Những căn phòng sang trọng nhất với đánh giá cao từ khách hàng.
              </p>
            </div>
            <Link href="/rooms" className="group">
              <Button
                variant="ghost"
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20 cursor-pointer text-base"
              >
                Xem tất cả phòng
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_ROOMS.map((room, index) => (
              <Card
                key={index}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-800 rounded-2xl cursor-pointer hover:-translate-y-2"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-sm font-bold text-orange-600 shadow-lg">
                    {formatPrice(room.price)}/đêm
                  </div>

                  {/* Favorite button */}
                  <button className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg">
                    <Heart className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  </button>

                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{room.rating}</span>
                    <span className="text-white/60">({room.reviews})</span>
                  </div>
                </div>

                <CardContent className="p-5">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3 group-hover:text-orange-600 transition-colors duration-300">
                    {room.name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Bed className="w-4 h-4 text-orange-500/70" />
                      <span>{room.beds} giường</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bath className="w-4 h-4 text-orange-500/70" />
                      <span>{room.baths} WC</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-orange-500/70" />
                      <span>{room.guests} khách</span>
                    </div>
                  </div>
                  <div className="mt-5 flex gap-2">
                    <Link href={`/rooms/${index + 1}`} className="flex-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-orange-200 dark:border-orange-800 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-400 cursor-pointer transition-all duration-300"
                      >
                        Chi tiết
                      </Button>
                    </Link>
                    <Link
                      href={`/booking?room=${index + 1}`}
                      className="flex-1"
                    >
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 cursor-pointer shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
                      >
                        Đặt ngay
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== WHY CHOOSE US SECTION ==================== */}
      <section className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden">
        {/* Subtle pattern bg */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16 space-y-4">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 tracking-wide uppercase">
              <Shield className="w-3.5 h-3.5 mr-1.5" />
              Cam kết của chúng tôi
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
              Tại sao chọn{" "}
              <span className="text-gradient">Stayzy</span>?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              Chúng tôi mang đến trải nghiệm đặt phòng tuyệt vời nhất với những
              cam kết vượt trội.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, index) => (
              <Card
                key={index}
                className="group border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 bg-white dark:bg-slate-800/50 rounded-2xl hover:-translate-y-2 cursor-default overflow-hidden"
              >
                <CardContent className="p-7 text-center relative">
                  {/* Subtle gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 to-amber-50/0 group-hover:from-orange-50/80 group-hover:to-amber-50/50 dark:group-hover:from-orange-950/20 dark:group-hover:to-amber-950/10 transition-all duration-500" />

                  <div className="relative">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:shadow-xl group-hover:shadow-orange-500/40 group-hover:scale-110 transition-all duration-500 group-hover:rotate-3">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== AMENITIES SECTION ==================== */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-orange-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-orange-950/10 relative overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-orange-500/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-orange-500/5 rounded-full" />

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-14 space-y-4">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Tiện ích đẳng cấp
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
              Dịch vụ &{" "}
              <span className="text-gradient">Tiện nghi</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              Tận hưởng những tiện ích cao cấp được thiết kế cho sự thoải mái
              của bạn.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {AMENITIES.map((amenity, index) => (
              <AmenityIcon key={index} {...amenity} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS SECTION ==================== */}
      <section className="py-24 bg-white dark:bg-slate-900 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14 space-y-4">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 tracking-wide uppercase">
              <Star className="w-3.5 h-3.5 mr-1.5" />
              Đánh giá từ khách hàng
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
              Khách hàng{" "}
              <span className="text-gradient">nói gì?</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              Hàng nghìn khách hàng đã tin tưởng và hài lòng với dịch vụ của
              Stayzy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TESTIMONIALS.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== NEWSLETTER SECTION ==================== */}
      <section className="py-24 bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 relative overflow-hidden">
        {/* Animated decorative blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 animate-float-slow" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3 animate-float-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full animate-float" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Nhận ưu đãi độc quyền
            </h2>
            <p className="text-white/90 text-lg md:text-xl leading-relaxed">
              Đăng ký nhận bản tin để không bỏ lỡ những khuyến mãi hấp dẫn và
              thông tin du lịch mới nhất.
            </p>
            <NewsletterForm />
            <p className="text-white/50 text-sm">
              Hơn 50,000 người đã đăng ký &bull; Không spam, hủy bất cứ lúc nào
            </p>
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA SECTION ==================== */}
      <section className="py-24 bg-slate-900 dark:bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl translate-y-1/2" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Sẵn sàng cho kỳ nghỉ{" "}
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                tiếp theo
              </span>
              ?
            </h2>
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
              Khám phá các loại phòng đa dạng và tìm không gian hoàn hảo cho
              bạn ngay hôm nay.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/rooms">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-lg px-10 py-7 shadow-xl shadow-orange-500/25 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer font-semibold"
                >
                  Xem tất cả phòng
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-white/10 hover:border-slate-400 text-lg px-10 py-7 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 font-semibold"
                >
                  Liên hệ tư vấn
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
