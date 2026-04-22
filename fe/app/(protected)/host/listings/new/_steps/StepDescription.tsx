"use client";

import { motion } from "framer-motion";
import { useListingStore } from "@/stores/useListingStore";
import { useRouter } from "next/navigation";
import StepWrapper from "./StepWrapper";
import { cn } from "@/lib/utils";

const TITLE_MAX = 50;
const DESC_MAX = 500;
const DESC_MIN = 50;

export default function StepDescription() {
  const router = useRouter();
  const { formData, updateFormData, nextStep } = useListingStore();

  const titleLen = formData.title.length;
  const descLen = formData.description.length;
  const canProceed = titleLen >= 5 && titleLen <= TITLE_MAX && descLen >= DESC_MIN;

  const handleNext = () => {
    nextStep();
    router.push("/host/listings/new?step=8");
  };

  return (
    <StepWrapper onNext={handleNext} nextDisabled={!canProceed}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div>
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-2">
            Bước 7
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Đặt tên và mô tả chỗ ở
          </h1>
          <p className="text-slate-500 text-lg">
            Tiêu đề và mô tả hấp dẫn giúp khách hiểu hơn về không gian của bạn.
          </p>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">
              Tiêu đề <span className="text-orange-500">*</span>
            </label>
            <span
              className={cn(
                "text-xs tabular-nums font-medium",
                titleLen > TITLE_MAX ? "text-red-500" : "text-slate-400"
              )}
            >
              {titleLen}/{TITLE_MAX}
            </span>
          </div>
          <input
            type="text"
            placeholder="Ví dụ: Căn hộ studio view hồ Tây thoáng đãng"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
            maxLength={TITLE_MAX + 10}
            className={cn(
              "w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none placeholder:text-slate-400 text-slate-900 font-medium",
              titleLen > TITLE_MAX
                ? "border-red-400 focus:border-red-500"
                : formData.title
                ? "border-orange-400 focus:border-orange-500"
                : "border-slate-200 focus:border-orange-500"
            )}
          />
          <p className="text-xs text-slate-400">
            Hãy nêu bật điểm đặc trưng: vị trí, phong cách, view...
          </p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">
              Mô tả <span className="text-orange-500">*</span>
            </label>
            <span
              className={cn(
                "text-xs tabular-nums font-medium",
                descLen > DESC_MAX ? "text-red-500" : descLen < DESC_MIN ? "text-slate-400" : "text-green-500"
              )}
            >
              {descLen}/{DESC_MAX}
            </span>
          </div>
          <textarea
            rows={7}
            placeholder={`Mô tả chi tiết về chỗ ở: không gian, nội thất nổi bật, điểm thu hút xung quanh, hướng dẫn check-in...\n\nVí dụ: Căn hộ nằm ngay trung tâm thành phố, view hồ Tây cực đẹp vào buổi sáng. Phòng được thiết kế theo phong cách Scandinavian, đầy đủ tiện nghi hiện đại...`}
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            className={cn(
              "w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none placeholder:text-slate-400 text-slate-900 resize-none leading-relaxed",
              descLen > DESC_MAX
                ? "border-red-400 focus:border-red-500"
                : formData.description
                ? "border-orange-400 focus:border-orange-500"
                : "border-slate-200 focus:border-orange-500"
            )}
          />
          {descLen > 0 && descLen < DESC_MIN && (
            <p className="text-xs text-amber-600">
              Cần thêm {DESC_MIN - descLen} ký tự để mô tả đầy đủ hơn.
            </p>
          )}
        </div>
      </motion.div>
    </StepWrapper>
  );
}
