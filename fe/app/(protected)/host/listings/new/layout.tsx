"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useListingStore } from "@/stores/useListingStore";
import { cn } from "@/lib/utils";

const STEPS = [
  { step: 1, label: "Loại chỗ ở" },
  { step: 2, label: "Kiểu nhà" },
  { step: 3, label: "Vị trí" },
  { step: 4, label: "Thông tin" },
  { step: 5, label: "Tiện nghi" },
  { step: 6, label: "Ảnh chụp" },
  { step: 7, label: "Mô tả" },
  { step: 8, label: "Giá" },
];

export default function NewListingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { step, totalSteps, setStep } = useListingStore();

  // Sync step với URL query param
  useEffect(() => {
    const urlStep = parseInt(searchParams.get("step") ?? "1");
    if (!isNaN(urlStep) && urlStep >= 1 && urlStep <= totalSteps) {
      setStep(urlStep);
    }
  }, [searchParams, setStep, totalSteps]);

  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent hidden sm:inline-block">
              Stayzy
            </span>
          </Link>

          {/* Step label */}
          <span className="text-sm font-medium text-slate-500">
            Bước {step} / {totalSteps} — {STEPS[step - 1]?.label}
          </span>

          {/* Exit */}
          <button
            onClick={() => router.push("/")}
            className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors underline underline-offset-2"
          >
            Thoát
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-slate-100 w-full">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step dots — desktop */}
        <div className="hidden md:flex items-center justify-center gap-2 py-2">
          {STEPS.map((s) => (
            <div
              key={s.step}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300",
                s.step === step
                  ? "bg-orange-100 text-orange-600"
                  : s.step < step
                  ? "text-slate-400"
                  : "text-slate-300"
              )}
            >
              <span
                className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold",
                  s.step < step
                    ? "bg-orange-500 text-white"
                    : s.step === step
                    ? "bg-orange-500 text-white"
                    : "bg-slate-200 text-slate-400"
                )}
              >
                {s.step < step ? "✓" : s.step}
              </span>
              {s.label}
            </div>
          ))}
        </div>
      </header>

      {/* ── Page content ── */}
      <main className="flex-1 container mx-auto px-4 py-10 max-w-3xl">
        {children}
      </main>
    </div>
  );
}