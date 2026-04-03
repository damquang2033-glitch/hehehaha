"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/rooms", label: "Phòng" },
  { href: "/services", label: "Dịch vụ" },
  { href: "/contact", label: "Liên hệ" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Gradient accent line at top */}
      <div className="h-[2px] bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 w-full fixed top-0 z-[60]" />

      <nav
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-500",
          scrolled
            ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20 border-b border-slate-200/50 dark:border-slate-800/50"
            : "bg-white/60 dark:bg-slate-950/60 backdrop-blur-md border-b border-transparent"
        )}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/30 group-hover:shadow-lg group-hover:shadow-orange-500/40 transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-base">S</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent hidden sm:inline-block tracking-tight">
              Stayzy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300",
                  "hover:text-orange-600 hover:bg-orange-50/80 dark:hover:bg-orange-900/10",
                  isActive(link.href)
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-slate-600 dark:text-slate-300"
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <Link href="/rooms" className="hidden md:block">
              <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 cursor-pointer font-medium hover:-translate-y-0.5">
                Đặt phòng ngay
              </Button>
            </Link>

            <ThemeToggle />

            <div className="hidden md:flex items-center gap-2">
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  className="text-slate-600 dark:text-slate-300 hover:text-orange-600 hover:bg-orange-50/80 dark:hover:bg-orange-900/10 transition-all duration-300 cursor-pointer font-medium"
                >
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  variant="outline"
                  className="border-orange-300 dark:border-orange-700 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-400 transition-all duration-300 cursor-pointer font-medium"
                >
                  Đăng ký
                </Button>
              </Link>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-600 dark:text-slate-300 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200/50 dark:border-slate-800/50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
            <div className="container mx-auto px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive(link.href)
                      ? "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400"
                      : "text-slate-600 dark:text-slate-300 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/10"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {isActive(link.href) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  )}
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-orange-300 text-orange-600 hover:bg-orange-50">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                    Đăng ký
                  </Button>
                </Link>
                <Link href="/rooms" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    Đặt phòng ngay
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
