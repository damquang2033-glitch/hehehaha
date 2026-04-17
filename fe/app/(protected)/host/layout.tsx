"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function HostLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user && user.role !== "HOST" && user.role !== "ADMIN") {
      router.replace("/profile");
    }
  }, [user, router]);

  if (!user || (user.role !== "HOST" && user.role !== "ADMIN")) return null;

  return <>{children}</>;
}
