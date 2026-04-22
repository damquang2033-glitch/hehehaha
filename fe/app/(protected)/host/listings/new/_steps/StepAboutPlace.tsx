"use client";

import { motion } from "framer-motion";
import { useListingStore } from "@/stores/useListingStore";
import { useRouter } from "next/navigation";
import StepWrapper from "./StepWrapper";
import { cn } from "@/lib/utils";

const PROPERTY_TYPES = [
  { id: "apartment", label: "Căn hộ", emoji: "🏢" },
  { id: "house", label: "Nhà nguyên căn", emoji: "🏠" },
  { id: "villa", label: "Biệt thự", emoji: "🏡" },
  { id: "room", label: "Phòng trọ", emoji: "🛏️" },
  { id: "hotel", label: "Khách sạn", emoji: "🏨" },
  { id: "resort", label: "Resort", emoji: "🌴" },
  { id: "homestay", label: "Homestay", emoji: "🏘️" },
  { id: "cabin", label: "Nhà cabin", emoji: "🪵" },
  { id: "other", label: "Khác", emoji: "✨" },
];

const RENTAL_TYPES = [
  {
    id: "entire",
    label: "Toàn bộ chỗ ở",
    desc: "Khách thuê toàn bộ không gian — chỉ riêng họ.",
    emoji: "🏠",
  },
  {
    id: "private",
    label: "Phòng riêng",
    desc: "Khách có phòng riêng, nhưng một số khu vực dùng chung.",
    emoji: "🚪",
  },
  {
    id: "shared",
    label: "Phòng chung",
    desc: "Khách ngủ trong phòng chung hoặc chia sẻ không gian.",
    emoji: "🛋️",
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4 },
  }),
};

export default function StepAboutPlace() {
  const router = useRouter();
  const { formData, updateFormData, nextStep } = useListingStore();

  const canProceed = !!formData.propertyType && !!formData.rentalType;

  const handleNext = () => {
    nextStep();
    router.push("/host/listings/new?step=2");
  };

  return (
    <StepWrapper
      onNext={handleNext}
      nextDisabled={!canProceed}
      hidePrev
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-10"
      >
        {/* Header */}
        <div>
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-2">
            Bước 1
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Chia sẻ thông tin về chỗ ở của bạn
          </h1>
          <p className="text-slate-500 text-lg">
            Chọn loại chỗ ở và hình thức cho thuê phù hợp nhất với không gian của bạn.
          </p>
        </div>

        {/* Property type */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Loại chỗ ở của bạn là gì?
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {PROPERTY_TYPES.map((type, i) => (
              <motion.button
                key={type.id}
                custom={i}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                onClick={() => updateFormData({ propertyType: type.id })}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer",
                  formData.propertyType === type.id
                    ? "border-orange-500 bg-orange-50 shadow-md shadow-orange-100"
                    : "border-slate-200 hover:border-orange-300 hover:bg-orange-50/50"
                )}
              >
                <span className="text-3xl">{type.emoji}</span>
                <span className="text-xs font-medium text-slate-700 text-center leading-tight">
                  {type.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Rental type */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Bạn cho thuê theo hình thức nào?
          </h2>
          <div className="space-y-3">
            {RENTAL_TYPES.map((type, i) => (
              <motion.button
                key={type.id}
                custom={i}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                onClick={() => updateFormData({ rentalType: type.id as any })}
                className={cn(
                  "w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer",
                  formData.rentalType === type.id
                    ? "border-orange-500 bg-orange-50 shadow-md shadow-orange-100"
                    : "border-slate-200 hover:border-orange-300 hover:bg-orange-50/50"
                )}
              >
                <span className="text-3xl">{type.emoji}</span>
                <div>
                  <p className="font-semibold text-slate-900">{type.label}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{type.desc}</p>
                </div>
                <div
                  className={cn(
                    "ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                    formData.rentalType === type.id
                      ? "border-orange-500 bg-orange-500"
                      : "border-slate-300"
                  )}
                >
                  {formData.rentalType === type.id && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </StepWrapper>
  );
}