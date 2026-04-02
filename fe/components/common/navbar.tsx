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
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-md border-b border-slate-200/60 dark:border-slate-800"
          : "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-white/10 dark:border-slate-800"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/30">
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
                "relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                "hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/10",
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
            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 transition-all duration-200 cursor-pointer font-medium">
              Đặt phòng ngay
            </Button>
          </Link>

          <ThemeToggle />

          <div className="hidden md:flex items-center gap-2">
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="border-orange-400 text-orange-600 hover:bg-orange-50 hover:border-orange-500 dark:border-orange-500/50 dark:text-orange-400 dark:hover:bg-orange-900/20 transition-all duration-200 cursor-pointer font-medium"
              >
                Đăng nhập
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-sm transition-all duration-200 cursor-pointer font-medium">
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
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 animate-in slide-in-from-top-2 duration-200">
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
                <Button variant="outline" className="w-full border-orange-400 text-orange-600 hover:bg-orange-50">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                  Đăng ký
                </Button>
              </Link>
              <Link href="/rooms" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                  Đặt phòng ngay
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
