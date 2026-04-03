"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AmenityIconProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  className?: string;
}

export function AmenityIcon({
  icon: Icon,
  label,
  description,
  className,
}: AmenityIconProps) {
  return (
    <div
      className={cn(
        "group flex flex-col items-center text-center p-4 cursor-default",
        "rounded-2xl transition-all duration-300",
        "hover:bg-white dark:hover:bg-slate-800/80",
        "hover:shadow-lg hover:shadow-orange-500/5 hover:-translate-y-1",
        className
      )}
    >
      <div
        className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center mb-3",
          "bg-gradient-to-br from-orange-500/10 to-amber-500/10",
          "group-hover:from-orange-500 group-hover:to-amber-500",
          "group-hover:shadow-lg group-hover:shadow-orange-500/25",
          "transition-all duration-500"
        )}
      >
        <Icon className="w-7 h-7 text-orange-600 dark:text-orange-400 group-hover:text-white transition-colors duration-500" />
      </div>
      <span className="font-semibold text-slate-900 dark:text-white text-sm">
        {label}
      </span>
      {description && (
        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {description}
        </span>
      )}
    </div>
  );
}
