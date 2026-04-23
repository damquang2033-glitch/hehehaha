"use client";

import { use, useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  X,
  Images,
  CheckCircle2,
  MessageCircle,
  Navigation,
  Camera,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { BookingCard } from "@/features/bookings/components/BookingCard";
import ReviewList from "@/features/reviews/components/ReviewList";

interface PageProps {
  params: Promise<{ id: string }>;
}

// ── Per-image tile with shimmer + S3 error fallback ──────────────────────────
interface GalleryTileProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  onClick?: () => void;
}

function GalleryTile({ src, alt, priority, className = "", onClick }: GalleryTileProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  return (
    <div
      className={`relative w-full h-full cursor-pointer overflow-hidden ${className}`}
      onClick={onClick}
    >
      {status === "loading" && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse z-10" />
      )}

      {status === "error" ? (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center gap-2">
          <Camera className="w-8 h-8 text-slate-300" />
          <span className="text-xs text-slate-400">Không tải được ảnh</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-all duration-500 group-hover:scale-105 ${
            status === "loading" ? "opacity-0" : "opacity-100"
          }`}
          priority={priority}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
        />
      )}
    </div>
  );
}

// ── Lightbox modal ────────────────────────────────────────────────────────────
interface LightboxProps {
  images: string[];
  initialIndex: number;
  title: string;
  onClose: () => void;
}

function Lightbox({ images, initialIndex, title, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(initialIndex);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const prev = useCallback(() => setCurrent((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next, onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const el = thumbsRef.current?.children[current] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [current]);

  const [imgStatus, setImgStatus] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => setImgStatus("loading"), [current]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/96 z-50 flex flex-col"
      onClick={onClose}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>
        <p className="text-sm font-medium text-white/60 tracking-widest select-none">
          {current + 1} / {images.length}
        </p>
        <div className="w-9" />
      </div>

      {/* Main image */}
      <div
        className="flex-1 relative flex items-center justify-center min-h-0 px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={prev}
          className="absolute left-3 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all active:scale-95"
          aria-label="Ảnh trước"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {imgStatus === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
              </div>
            )}
            {imgStatus === "error" ? (
              <div className="flex flex-col items-center gap-3 text-white/40">
                <Camera className="w-12 h-12" />
                <span className="text-sm">Không tải được ảnh</span>
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={images[current]}
                alt={`${title} – ảnh ${current + 1}`}
                className={`max-h-full max-w-full object-contain rounded-xl select-none transition-opacity duration-300 ${
                  imgStatus === "loading" ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setImgStatus("loaded")}
                onError={() => setImgStatus("error")}
                draggable={false}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <button
          onClick={next}
          className="absolute right-3 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all active:scale-95"
          aria-label="Ảnh tiếp theo"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div
        className="shrink-0 py-4 px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          ref={thumbsRef}
          className="flex gap-2 justify-center overflow-x-auto scrollbar-none pb-1"
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all duration-200 ${
                current === idx
                  ? "border-white scale-105 opacity-100"
                  : "border-transparent opacity-40 hover:opacity-70"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ListingDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { data: listing, isLoading, isError } = useListing(id);
  const currentUser = useAuthStore((s) => s.user);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  if (isLoading) return <ListingDetailSkeleton />;

  if (isError || !listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#faf9f7]">
        <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center">
          <X className="w-9 h-9 text-orange-400" />
        </div>
        <p className="text-slate-600 text-lg">Không tìm thấy chỗ ở này.</p>
        <Link href="/rooms">
          <Button variant="outline" className="rounded-full px-6">
            Quay lại danh sách
          </Button>
        </Link>
      </div>
    );
  }

  const images = listing.images.length > 0 ? listing.images : [];
  const hostInitial = listing.host.name?.[0]?.toUpperCase() ?? "H";
  const isOwner = currentUser?.id === listing.hostId;

  const tabs = [
    { key: "description", label: "Mô tả", icon: MessageCircle },
    { key: "amenities", label: "Tiện nghi", icon: CheckCircle2 },
    { key: "reviews", label: "Đánh giá", icon: Star },
    { key: "location", label: "Vị trí", icon: Navigation },
    { key: "host", label: "Chủ nhà", icon: Users },
  ];

  const EmptyImageSlot = () => (
    <div className="w-full h-full bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center">
      <Camera className="w-10 h-10 text-orange-200" />
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-[#faf9f7]">
        <div className="container mx-auto px-4 pt-8 pb-28 max-w-7xl">

          {/* ── Top bar ─────────────────────────────────────────── */}
          <div className="flex items-center justify-between mb-7">
            <Link
              href="/rooms"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-orange-600 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              Quay lại danh sách
            </Link>
            {isOwner && (
              <Link href={`/host/listings/${id}/edit`}>
                <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
                  <Pencil className="h-3.5 w-3.5" />
                  Chỉnh sửa
                </Button>
              </Link>
            )}
          </div>

          {/* ── Title ───────────────────────────────────────────── */}
          <div className="mb-5">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 leading-tight">
              {listing.title}
            </h1>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-slate-800">
                    {listing.averageRating?.toFixed(1) ?? "Mới"}
                  </span>
                  {listing.reviewCount != null && (
                    <>
                      <span className="text-slate-300 mx-1">·</span>
                      <span className="underline cursor-pointer text-slate-600">
                        {listing.reviewCount} đánh giá
                      </span>
                    </>
                  )}
                </div>
                <span className="text-slate-300 hidden sm:block">·</span>
                <div className="flex items-center gap-1 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />
                  <span>{listing.location}</span>
                </div>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => setIsFavorite((f) => !f)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-slate-100 ${
                    isFavorite ? "text-rose-500" : "text-slate-700"
                  }`}
                >
                  <Heart className={`w-4 h-4 transition-transform active:scale-125 ${isFavorite ? "fill-current" : ""}`} />
                  {isFavorite ? "Đã lưu" : "Lưu"}
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all">
                  <Share2 className="w-4 h-4" />
                  Chia sẻ
                </button>
              </div>
            </div>
          </div>

          {/* ── Image Gallery ────────────────────────────────────── */}
          <div className="relative mb-12">
            {images.length === 0 ? (
              /* No images placeholder */
              <div className="rounded-2xl overflow-hidden h-[300px] md:h-[480px] bg-gradient-to-br from-orange-50 to-amber-100 flex flex-col items-center justify-center gap-3">
                <Camera className="w-16 h-16 text-orange-200" />
                <p className="text-sm text-slate-400">Chưa có ảnh</p>
              </div>
            ) : (
              <>
                {/* Mobile: single large image with counter */}
                <div
                  className="block md:hidden relative rounded-2xl overflow-hidden h-[260px] group"
                  onClick={() => setLightboxIndex(0)}
                >
                  <GalleryTile src={images[0]} alt={listing.title} priority />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {images.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                      1 / {images.length}
                    </div>
                  )}
                </div>

                {/* Desktop: Airbnb-style 5-slot grid */}
                <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-[480px]">
                  {/* Main large image – spans 2 cols × 2 rows */}
                  <div className="col-span-2 row-span-2 relative group">
                    {images[0] ? (
                      <GalleryTile
                        src={images[0]}
                        alt={listing.title}
                        priority
                        onClick={() => setLightboxIndex(0)}
                      />
                    ) : (
                      <EmptyImageSlot />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors pointer-events-none" />
                  </div>

                  {/* Side thumbnails – 4 slots in 2×2 */}
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="relative group">
                      {images[slot] ? (
                        <GalleryTile
                          src={images[slot]}
                          alt={`${listing.title} ${slot + 1}`}
                          onClick={() => setLightboxIndex(slot)}
                        />
                      ) : (
                        <EmptyImageSlot />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors pointer-events-none" />
                    </div>
                  ))}
                </div>

                {/* View all button */}
                <button
                  onClick={() => setLightboxIndex(0)}
                  className="absolute bottom-4 right-4 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold px-5 py-2.5 rounded-full shadow-md border border-slate-200 flex items-center gap-2 transition-all hover:shadow-lg z-10 active:scale-95"
                >
                  <Images className="w-4 h-4" />
                  Xem tất cả {images.length} ảnh
                </button>
              </>
            )}
          </div>

          {/* ── Main layout ──────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Left column */}
            <div className="lg:col-span-2">

              {/* Host strip */}
              <div className="flex items-start justify-between pb-8 mb-8 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">
                    Chủ nhà: {listing.host.name ?? "Chủ nhà"}
                  </h2>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-600 mt-2">
                    {listing.maxGuests != null && (
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-orange-500" />
                        {listing.maxGuests} khách
                      </span>
                    )}
                    {listing.bedrooms != null && (
                      <span className="flex items-center gap-1.5">
                        <Bed className="w-3.5 h-3.5 text-orange-500" />
                        {listing.bedrooms} phòng ngủ
                      </span>
                    )}
                    {listing.bathrooms != null && (
                      <span className="flex items-center gap-1.5">
                        <Bath className="w-3.5 h-3.5 text-orange-500" />
                        {listing.bathrooms} phòng tắm
                      </span>
                    )}
                  </div>
                </div>
                <Avatar className="h-14 w-14 ring-2 ring-white shadow-md shrink-0">
                  <AvatarImage src={listing.host.avatar ?? undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-orange-400 to-amber-400 text-white text-lg font-bold">
                    {hostInitial}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Tab navigation */}
              <div className="mb-8">
                <div className="flex border-b border-slate-200 mb-6 overflow-x-auto scrollbar-none gap-1">
                  {tabs.map(({ key, label }) => (
                    <motion.button
                      key={key}
                      whileHover={{ y: -1 }}
                      onClick={() => setActiveTab(key)}
                      className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                        activeTab === key
                          ? "border-b-2 border-orange-500 text-orange-600"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {label}
                      {key === "reviews" && listing.reviewCount != null && (
                        <span className="ml-1 text-xs opacity-70">({listing.reviewCount})</span>
                      )}
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="min-h-[260px]"
                  >
                    {activeTab === "description" && (
                      <div className="prose prose-slate max-w-none">
                        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                          {listing.description ?? "Không có mô tả."}
                        </p>
                      </div>
                    )}

                    {activeTab === "amenities" && (
                      <div>
                        {listing.amenities && listing.amenities.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {listing.amenities.map((a: string, i: number) => (
                              <div
                                key={i}
                                className="flex items-center gap-2.5 bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-700 shadow-sm hover:shadow-md transition-shadow"
                              >
                                <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                                {a}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-slate-500 text-sm">Chưa có thông tin tiện nghi.</p>
                        )}
                      </div>
                    )}

                    {activeTab === "reviews" && <ReviewList listingId={id} />}

                    {activeTab === "location" && (
                      <div>
                        <div className="flex items-center gap-2 mb-4 text-slate-700">
                          <MapPin className="w-5 h-5 text-orange-500" />
                          <span className="font-medium">{listing.location}</span>
                        </div>
                        <div className="w-full h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-sm gap-2">
                          <Navigation className="w-7 h-7 opacity-30" />
                          Bản đồ
                        </div>
                      </div>
                    )}

                    {activeTab === "host" && (
                      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-5 mb-6">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={listing.host.avatar ?? undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-amber-400 text-white text-xl font-bold">
                              {hostInitial}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xl font-bold text-slate-900">
                              {listing.host.name ?? "Chủ nhà"}
                            </p>
                            <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                              <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                              Chủ nhà đã được xác minh
                            </div>
                          </div>
                        </div>
                        {listing.host.bio && (
                          <p className="text-slate-600 leading-relaxed text-sm">
                            {listing.host.bio}
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Right column – booking card */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <BookingCard listing={listing} isOwner={isOwner} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile booking bar ──────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 lg:hidden z-40 shadow-xl">
        <div className="container mx-auto max-w-lg flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-slate-900">
              {listing.price != null
                ? `₫${listing.price.toLocaleString("vi-VN")}`
                : "Liên hệ"}
              <span className="text-sm font-normal text-slate-500"> / đêm</span>
            </p>
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-medium">{listing.averageRating?.toFixed(1) ?? "—"}</span>
              {listing.reviewCount != null && (
                <span className="text-slate-400">· {listing.reviewCount} đánh giá</span>
              )}
            </div>
          </div>
          <button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-7 py-3 rounded-full font-bold shadow-lg hover:from-orange-600 hover:to-amber-600 transition-all active:scale-95">
            Đặt ngay
          </button>
        </div>
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && images.length > 0 && (
          <Lightbox
            images={images}
            initialIndex={lightboxIndex}
            title={listing.title}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function ListingDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Skeleton className="h-4 w-32 mb-7 rounded-full" />
        <Skeleton className="h-9 w-2/3 mb-3 rounded-xl" />
        <Skeleton className="h-4 w-1/3 mb-6 rounded-full" />

        {/* Gallery skeleton */}
        <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-[480px] mb-12">
          <Skeleton className="col-span-2 row-span-2 rounded-none h-full" />
          <Skeleton className="rounded-none h-full" />
          <Skeleton className="rounded-none h-full" />
          <Skeleton className="rounded-none h-full" />
          <Skeleton className="rounded-none h-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-5">
            <Skeleton className="h-16 w-full rounded-xl" />
            <div className="flex gap-2 border-b pb-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-44 w-full rounded-2xl" />
          </div>
          <div>
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
