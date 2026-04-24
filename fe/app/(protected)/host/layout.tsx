"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Plus,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/host", label: "Tổng quan", icon: LayoutDashboard, exact: true },
  { href: "/host/listings", label: "Chỗ ở của tôi", icon: BedDouble, exact: false },
  { href: "/host/bookings", label: "Quản lý booking", icon: CalendarCheck, exact: false },
];

function NavLink({
  href,
  label,
  icon: Icon,
  exact,
  pathname,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  exact: boolean;
  pathname: string;
  onClick?: () => void;
}) {
  const active = exact ? pathname === href : pathname.startsWith(href);
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
        active
          ? "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400"
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
      )}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {label}
    </Link>
  );
}

export default function HostLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (user && user.role !== "HOST" && user.role !== "ADMIN") {
      router.replace("/profile");
    }
  }, [user, router]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!user || (user.role !== "HOST" && user.role !== "ADMIN")) return null;

  // Wizard has its own full-screen layout — render without sidebar
  if (pathname.startsWith("/host/listings/new")) {
    return <>{children}</>;
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="h-16 px-5 flex items-center border-b border-slate-100 dark:border-slate-800 shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-none">Host Portal</p>
            <p className="text-[11px] text-slate-400 leading-none mt-0.5">Stayzy</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            pathname={pathname}
            onClick={() => setMobileOpen(false)}
          />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-4 shrink-0">
        <Link
          href="/host/listings/new"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-sm shadow-orange-500/20"
        >
          <Plus className="w-4 h-4" />
          Đăng chỗ ở mới
        </Link>

        <div className="flex items-center gap-3 px-1">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
              <span className="text-orange-600 dark:text-orange-400 font-bold text-sm">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
              {user.name}
            </p>
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-orange-500 transition-colors"
            >
              ← Về trang chính
            </Link>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ── Mobile top bar ── */}
      <header className="md:hidden sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-14 px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
            <span className="text-white font-bold text-xs">S</span>
          </div>
          <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Host Portal</span>
        </Link>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-30 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="md:hidden fixed top-14 left-0 bottom-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
            {/* skip logo in drawer since top bar has it */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.href}
                  {...item}
                  pathname={pathname}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </nav>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <Link
                href="/host/listings/new"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all"
              >
                <Plus className="w-4 h-4" />
                Đăng chỗ ở mới
              </Link>
              <Link href="/" className="block text-xs text-center text-slate-400 hover:text-orange-500 transition-colors">
                ← Về trang chính
              </Link>
            </div>
          </div>
        </>
      )}

      {/* ── Desktop layout ── */}
      <div className="hidden md:flex">
        {/* Sidebar — sticky, scrolls with page */}
        <aside className="w-60 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col sticky top-0 h-screen">
          {sidebarContent}
        </aside>

        {/* Page content — natural page scroll */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>

      {/* ── Mobile content (below top bar) ── */}
      <div className="md:hidden">
        {children}
      </div>
    </div>
  );
}
