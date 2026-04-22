"use client";

import { motion } from "framer-motion";
import { useListingStore } from "@/stores/useListingStore";
import { useRouter } from "next/navigation";
import StepWrapper from "./StepWrapper";
import { cn } from "@/lib/utils";

const AMENITY_GROUPS = [
  {
    group: "Cơ bản",
    items: [
      { id: "wifi", label: "WiFi", emoji: "📶" },
      { id: "ac", label: "Điều hoà", emoji: "❄️" },
      { id: "tv", label: "TV", emoji: "📺" },
      { id: "kitchen", label: "Bếp", emoji: "🍳" },
      { id: "washer", label: "Máy giặt", emoji: "🫧" },
      { id: "parking", label: "Bãi đỗ xe", emoji: "🅿️" },
    ],
  },
  {
    group: "Tiện nghi nổi bật",
    items: [
      { id: "pool", label: "Hồ bơi", emoji: "🏊" },
      { id: "gym", label: "Phòng gym", emoji: "🏋️" },
      { id: "hot_tub", label: "Bồn tắm Jacuzzi", emoji: "🛁" },
      { id: "bbq", label: "Khu vực BBQ", emoji: "🔥" },
      { id: "garden", label: "Sân vườn", emoji: "🌳" },
      { id: "balcony", label: "Ban công / Hiên", emoji: "🪴" },
    ],
  },
  {
    group: "An toàn",
    items: [
      { id: "smoke_detector", label: "Đầu báo khói", emoji: "🚨" },
      { id: "first_aid", label: "Hộp sơ cứu", emoji: "🩺" },
      { id: "fire_extinguisher", label: "Bình cứu hoả", emoji: "🧯" },
      { id: "security_camera", label: "Camera an ninh", emoji: "📷" },
    ],
  },
];

const fadeIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.03, duration: 0.3 },
  }),
};

export default function StepAmenities() {
  const router = useRouter();
  const { formData, updateFormData, nextStep } = useListingStore();

  const toggle = (id: string) => {
    const current = formData.amenities;
    const next = current.includes(id)
      ? current.filter((a) => a !== id)
      : [...current, id];
    updateFormData({ amenities: next });
  };

  const handleNext = () => {
    nextStep();
    router.push("/host/listings/new?step=6");
  };

  let globalIdx = 0;

  return (
    <StepWrapper onNext={handleNext}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div>
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-2">
            Bước 5
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Chỗ ở có những tiện nghi gì?
          </h1>
          <p className="text-slate-500 text-lg">
            Chọn tất cả tiện nghi hiện có. Bạn có thể bổ sung sau.
          </p>
        </div>

        {formData.amenities.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-slate-500">Đã chọn:</span>
            {formData.amenities.map((id) => {
              const item = AMENITY_GROUPS.flatMap((g) => g.items).find((a) => a.id === id);
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full"
                >
                  {item?.emoji} {item?.label}
                </span>
              );
            })}
          </div>
        )}

        {AMENITY_GROUPS.map(({ group, items }) => (
          <div key={group} className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              {group}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {items.map((item) => {
                const idx = globalIdx++;
                const selected = formData.amenities.includes(item.id);
                return (
                  <motion.button
                    key={item.id}
                    custom={idx}
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    onClick={() => toggle(item.id)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer",
                      selected
                        ? "border-orange-500 bg-orange-50 shadow-sm shadow-orange-100"
                        : "border-slate-200 hover:border-orange-300 hover:bg-orange-50/40"
                    )}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-sm font-medium text-slate-700">
                      {item.label}
                    </span>
                    {selected && (
                      <span className="ml-auto text-orange-500 text-xs font-bold">✓</span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </motion.div>
    </StepWrapper>
  );
}
