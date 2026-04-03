"use client";

import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  name: string;
  avatar?: string;
  location: string;
  rating: number;
  comment: string;
  date?: string;
  className?: string;
}

export function TestimonialCard({
  name,
  avatar,
  location,
  rating,
  comment,
  date,
  className,
}: TestimonialCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={cn(
        "group relative p-7 rounded-2xl cursor-default",
        "bg-white dark:bg-slate-800/50",
        "border border-slate-100 dark:border-slate-700/50",
        "shadow-sm hover:shadow-xl transition-all duration-500",
        "hover:-translate-y-2",
        className
      )}
    >
      {/* Quote Icon */}
      <div className="absolute top-5 right-5">
        <Quote className="w-8 h-8 text-orange-500/10 group-hover:text-orange-500/20 transition-colors duration-300 fill-current" />
      </div>

      {/* Rating Stars */}
      <div className="flex gap-1 mb-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "w-4 h-4 transition-transform duration-300",
              i < rating
                ? "fill-amber-400 text-amber-400 group-hover:scale-110"
                : "fill-slate-200 text-slate-200 dark:fill-slate-600 dark:text-slate-600"
            )}
            style={{ transitionDelay: `${i * 50}ms` }}
          />
        ))}
      </div>

      {/* Comment */}
      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 line-clamp-4">
        &ldquo;{comment}&rdquo;
      </p>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent mb-5" />

      {/* Author Info */}
      <div className="flex items-center gap-3">
        <Avatar className="h-11 w-11 border-2 border-orange-500/20 group-hover:border-orange-500/40 transition-colors duration-300">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-gradient-to-br from-orange-500 to-amber-500 text-white text-sm font-semibold">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
            {name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {location}
          </p>
        </div>
        {date && (
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            {date}
          </span>
        )}
      </div>
    </div>
  );
}
