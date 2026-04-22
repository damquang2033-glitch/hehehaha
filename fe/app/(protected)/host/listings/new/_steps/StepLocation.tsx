"use client";

import { motion } from "framer-motion";
import { useListingStore } from "@/stores/useListingStore";
import { useRouter } from "next/navigation";
import StepWrapper from "./StepWrapper";

const COUNTRIES = [
  "Việt Nam",
  "Thái Lan",
  "Singapore",
  "Malaysia",
  "Indonesia",
  "Philippines",
  "Nhật Bản",
  "Hàn Quốc",
  "Trung Quốc",
  "Khác",
];

export default function StepLocation() {
  const router = useRouter();
  const { formData, updateFormData, nextStep } = useListingStore();

  const canProceed = !!formData.address.trim() && !!formData.city.trim();

  const handleNext = () => {
    nextStep();
    router.push("/host/listings/new?step=4");
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
            Bước 3
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Chỗ ở của bạn ở đâu?
          </h1>
          <p className="text-slate-500 text-lg">
            Địa chỉ sẽ chỉ hiển thị đầy đủ với khách sau khi đặt phòng thành công.
          </p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Quốc gia
            </label>
            <select
              value={formData.country}
              onChange={(e) => updateFormData({ country: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:outline-none focus:ring-0 bg-white text-slate-900 transition-colors"
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Thành phố / Tỉnh <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Hà Nội, Đà Nẵng, TP. Hồ Chí Minh..."
              value={formData.city}
              onChange={(e) => updateFormData({ city: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:outline-none focus:ring-0 transition-colors placeholder:text-slate-400 text-slate-900"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Địa chỉ cụ thể <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
              value={formData.address}
              onChange={(e) => updateFormData({ address: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:outline-none focus:ring-0 transition-colors placeholder:text-slate-400 text-slate-900"
            />
          </div>
        </div>

        {(formData.city || formData.address) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-100 rounded-2xl"
          >
            <span className="text-2xl">📍</span>
            <div>
              <p className="text-sm font-medium text-slate-700">Hiển thị trên listing</p>
              <p className="text-slate-900 font-semibold mt-0.5">
                {[formData.city, formData.country].filter(Boolean).join(", ")}
              </p>
              {formData.address && (
                <p className="text-sm text-slate-500 mt-0.5">{formData.address}</p>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </StepWrapper>
  );
}
