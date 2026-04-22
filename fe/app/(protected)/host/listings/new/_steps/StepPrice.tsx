"use client";

import { motion } from "framer-motion";
import { useListingStore } from "@/stores/useListingStore";
import { useRouter } from "next/navigation";
import { useCreateListing } from "@/features/listings/hooks/useListingMutations";
import StepWrapper from "./StepWrapper";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PRICE_SUGGESTIONS = [200000, 350000, 500000, 800000, 1200000, 2000000];

function formatVND(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value);
}

export default function StepPrice() {
  const router = useRouter();
  const { formData, updateFormData, reset } = useListingStore();
  const createListing = useCreateListing();

  const canProceed = formData.pricePerNight >= 50000;

  const handleSubmit = async () => {
    const location = [formData.address, formData.city, formData.country]
      .filter(Boolean)
      .join(", ");

    try {
      await createListing.mutateAsync({
        title: formData.title,
        description: formData.description,
        price: formData.pricePerNight,
        location,
        images: formData.photos,
        maxGuests: formData.maxGuests,
        bedrooms: formData.bedrooms,
        beds: formData.beds,
        bathrooms: formData.bathrooms,
        amenities: formData.amenities,
        propertyType: formData.propertyType,
        rentalType: formData.rentalType,
        structure: formData.structure,
      });

      toast.success("Đăng chỗ ở thành công! 🎉");
      reset();
      router.push("/host");
    } catch {
      toast.error("Đăng thất bại. Vui lòng thử lại.");
    }
  };

  const handlePriceInput = (raw: string) => {
    const num = parseInt(raw.replace(/\D/g, ""), 10);
    updateFormData({ pricePerNight: isNaN(num) ? 0 : num });
  };

  return (
    <StepWrapper
      onNext={handleSubmit}
      nextDisabled={!canProceed}
      isLoading={createListing.isPending}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div>
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-2">
            Bước 8
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Đặt giá cho một đêm
          </h1>
          <p className="text-slate-500 text-lg">
            Bạn có thể thay đổi giá bất kỳ lúc nào sau khi đăng.
          </p>
        </div>

        {/* Price input */}
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={formData.pricePerNight > 0 ? formatVND(formData.pricePerNight) : ""}
              onChange={(e) => handlePriceInput(e.target.value)}
              placeholder="0"
              className={cn(
                "w-full text-4xl font-bold text-slate-900 border-0 border-b-4 pb-3 focus:outline-none bg-transparent transition-colors pr-20",
                formData.pricePerNight >= 50000
                  ? "border-orange-500"
                  : "border-slate-200 focus:border-orange-300"
              )}
            />
            <span className="absolute right-0 bottom-3 text-lg font-semibold text-slate-400">
              VNĐ/đêm
            </span>
          </div>

          {formData.pricePerNight > 0 && formData.pricePerNight < 50000 && (
            <p className="text-sm text-amber-600">Giá tối thiểu là 50.000 VNĐ/đêm.</p>
          )}
        </div>

        {/* Suggestions */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-500">Gợi ý phổ biến</p>
          <div className="flex flex-wrap gap-2">
            {PRICE_SUGGESTIONS.map((price) => (
              <button
                key={price}
                onClick={() => updateFormData({ pricePerNight: price })}
                className={cn(
                  "px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all duration-200",
                  formData.pricePerNight === price
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "border-slate-200 text-slate-700 hover:border-orange-300 hover:bg-orange-50"
                )}
              >
                {formatVND(price)}đ
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        {formData.pricePerNight >= 50000 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl space-y-2"
          >
            <p className="text-sm font-semibold text-orange-700">Tóm tắt listing</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
              <span className="text-slate-500">Tiêu đề</span>
              <span className="font-medium text-slate-900 truncate">{formData.title || "—"}</span>
              <span className="text-slate-500">Vị trí</span>
              <span className="font-medium text-slate-900">{formData.city || "—"}, {formData.country}</span>
              <span className="text-slate-500">Khách tối đa</span>
              <span className="font-medium text-slate-900">{formData.maxGuests} người</span>
              <span className="text-slate-500">Phòng ngủ</span>
              <span className="font-medium text-slate-900">{formData.bedrooms} phòng · {formData.beds} giường</span>
              <span className="text-slate-500">Ảnh</span>
              <span className="font-medium text-slate-900">{formData.photos.length} ảnh</span>
              <span className="text-slate-500">Giá / đêm</span>
              <span className="font-bold text-orange-600">{formatVND(formData.pricePerNight)} VNĐ</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </StepWrapper>
  );
}
