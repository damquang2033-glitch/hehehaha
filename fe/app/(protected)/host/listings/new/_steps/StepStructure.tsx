"use client";

import { motion } from "framer-motion";
import { useListingStore } from "@/stores/useListingStore";
import { useRouter } from "next/navigation";
import StepWrapper from "./StepWrapper";
import { cn } from "@/lib/utils";

const STRUCTURES = [
  { id: "apartment_unit", label: "Căn hộ studio / 1 phòng", emoji: "🛋️" },
  { id: "townhouse", label: "Nhà phố", emoji: "🏘️" },
  { id: "detached_house", label: "Nhà độc lập", emoji: "🏠" },
  { id: "bungalow", label: "Bungalow", emoji: "🌿" },
  { id: "penthouse", label: "Penthouse", emoji: "🌆" },
  { id: "serviced_apt", label: "Căn hộ dịch vụ", emoji: "🏢" },
  { id: "guest_house", label: "Nhà khách / Guest house", emoji: "🛖" },
  { id: "treehouse", label: "Nhà trên cây", emoji: "🌳" },
  { id: "boat", label: "Nhà thuyền", emoji: "⛵" },
  { id: "rv", label: "Xe lưu động / RV", emoji: "🚐" },
  { id: "tent", label: "Lều trại / Glamping", emoji: "⛺" },
  { id: "other", label: "Khác", emoji: "✨" },
];

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.35 },
  }),
};

export default function StepStructure() {
  const router = useRouter();
  const { formData, updateFormData, nextStep } = useListingStore();

  const canProceed = !!formData.structure;

  const handleNext = () => {
    nextStep();
    router.push("/host/listings/new?step=3");
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
            Bước 2
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Kiểu không gian của bạn là gì?
          </h1>
          <p className="text-slate-500 text-lg">
            Chọn loại cấu trúc mô tả chính xác nhất nơi khách sẽ lưu trú.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {STRUCTURES.map((s, i) => (
            <motion.button
              key={s.id}
              custom={i}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              onClick={() => updateFormData({ structure: s.id })}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-center",
                formData.structure === s.id
                  ? "border-orange-500 bg-orange-50 shadow-md shadow-orange-100"
                  : "border-slate-200 hover:border-orange-300 hover:bg-orange-50/50"
              )}
            >
              <span className="text-3xl">{s.emoji}</span>
              <span className="text-xs font-medium text-slate-700 leading-tight">
                {s.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </StepWrapper>
  );
}
