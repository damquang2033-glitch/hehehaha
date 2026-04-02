"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/common/navbar";
import { Footer } from "@/components/common/footer";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname.startsWith("/auth");

  const hideNavbarFooter = isAdminRoute || isAuthRoute;

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      <main className="flex-1">{children}</main>
      {!hideNavbarFooter && <Footer />}
    </>
  );
}
