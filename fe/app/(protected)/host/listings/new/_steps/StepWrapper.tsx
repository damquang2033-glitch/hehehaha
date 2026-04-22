"use client";

import { useRouter } from "next/navigation";
import { useListingStore } from "@/stores/useListingStore";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type StepWrapperProps = {
  children: React.ReactNode;
  onNext?: () => void | Promise<void>;
  nextLabel?: string;
  nextDisabled?: boolean;
  isLoading?: boolean;
  hidePrev?: boolean;
};

export default function StepWrapper({
  children,
  onNext,
  nextLabel = "Tiếp theo",
  nextDisabled = false,
  isLoading = false,
  hidePrev = false,
}: StepWrapperProps) {
  const router = useRouter();
  const { step, totalSteps, nextStep, prevStep } = useListingStore();

  const handleNext = async () => {
    if (onNext) await onNext();
    else {
      nextStep();
      router.push(`/host/listings/new?step=${step + 1}`);
    }
  };

  const handlePrev = () => {
    prevStep();
    router.push(`/host/listings/new?step=${step - 1}`);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-10rem)]">
      {/* Content */}
      <div className="flex-1">{children}</div>

      {/* Nav buttons */}
      <div className="flex items-center justify-between pt-10 mt-10 border-t border-slate-100">
        {!hidePrev && step > 1 ? (
          <button
            onClick={handlePrev}
            disabled={isLoading}
            className="px-6 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 disabled:opacity-50"
          >
            Quay lại
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={handleNext}
          disabled={nextDisabled || isLoading}
          className={cn(
            "inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200",
            nextDisabled || isLoading
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/20 hover:-translate-y-0.5 hover:shadow-lg"
          )}
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {step === totalSteps ? "Đăng chỗ ở" : nextLabel}
        </button>
      </div>
    </div>
  );
}