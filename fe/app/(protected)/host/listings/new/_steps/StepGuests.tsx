"use client";

import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useListingStore } from "@/stores/useListingStore";
import { useRouter } from "next/navigation";
import StepWrapper from "./StepWrapper";

type CounterField = "maxGuests" | "bedrooms" | "beds" | "bathrooms";

const COUNTERS: { field: CounterField; label: string; desc: string; min: number }[] = [
  { field: "maxGuests", label: "Số khách tối đa", desc: "Có thể chứa bao nhiêu khách?", min: 1 },
  { field: "bedrooms", label: "Phòng ngủ", desc: "Bao nhiêu phòng ngủ?", min: 0 },
  { field: "beds", label: "Giường", desc: "Có bao nhiêu giường?", min: 1 },
  { field: "bathrooms", label: "Phòng tắm", desc: "Có bao nhiêu phòng tắm?", min: 0 },
];

export default function StepGuests() {
  const router = useRouter();
  const { formData, updateFormData, nextStep } = useListingStore();

  const handleNext = () => {
    nextStep();
    router.push("/host/listings/new?step=5");
  };

  const adjust = (field: CounterField, delta: number, min: number) => {
    const next = Math.max(min, formData[field] + delta);
    updateFormData({ [field]: next });
  };

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
            Bước 4
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Chỗ ở của bạn có gì?
          </h1>
          <p className="text-slate-500 text-lg">
            Thêm số lượng khách, phòng ngủ và phòng tắm để khách biết không gian phù hợp.
          </p>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
          {COUNTERS.map(({ field, label, desc, min }) => (
            <div
              key={field}
              className="flex items-center justify-between px-6 py-5 bg-white hover:bg-slate-50/50 transition-colors"
            >
              <div>
                <p className="font-semibold text-slate-900">{label}</p>
                <p className="text-sm text-slate-500 mt-0.5">{desc}</p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => adjust(field, -1, min)}
                  disabled={formData[field] <= min}
                  className="w-9 h-9 rounded-full border-2 border-slate-300 flex items-center justify-center text-slate-600 hover:border-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-6 text-center font-semibold text-slate-900 text-lg tabular-nums">
                  {formData[field]}
                </span>
                <button
                  onClick={() => adjust(field, 1, min)}
                  className="w-9 h-9 rounded-full border-2 border-slate-300 flex items-center justify-center text-slate-600 hover:border-orange-500 hover:text-orange-500 transition-all"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </StepWrapper>
  );
}
