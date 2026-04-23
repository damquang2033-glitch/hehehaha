"use client";

import Link from "next/link";
import { BedDouble, CalendarCheck, Clock, Plus, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/authStore";
import { useListings } from "@/features/listings/hooks/useListings";
import { useHostBookings } from "@/features/bookings/hooks/useBookings";

function StatCard({
  title,
  value,
  icon: Icon,
  isLoading,
  color,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  isLoading: boolean;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{title}</p>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function HostDashboardPage() {
  const user = useAuthStore((s) => s.user);

  const { data: listingsData, isLoading: listingsLoading } = useListings(
    user ? { hostId: user.id, limit: 1 } : undefined
  );
  const { data: bookingsData, isLoading: bookingsLoading } = useHostBookings(1);

  const totalListings = listingsData?.total ?? 0;
  const totalBookings = bookingsData?.total ?? 0;
  const pendingCount = bookingsData?.data.filter((b) => b.status === "PENDING").length ?? 0;
  const recentBookings = bookingsData?.data.slice(0, 5) ?? [];

  const statusLabel: Record<string, string> = {
    PENDING: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    CANCELLED: "Đã hủy",
    COMPLETED: "Hoàn thành",
  };
  const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    PENDING: "secondary",
    CONFIRMED: "default",
    CANCELLED: "destructive",
    COMPLETED: "outline",
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                Xin chào, {user?.name ?? "Host"} 👋
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Tổng quan hoạt động của bạn
              </p>
            </div>
            <Button asChild>
              <Link href="/host/listings/new">
                <Plus className="w-4 h-4 mr-2" />
                Đăng chỗ ở mới
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Chỗ ở của bạn"
            value={totalListings}
            icon={BedDouble}
            isLoading={listingsLoading}
            color="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
          />
          <StatCard
            title="Tổng lượt đặt phòng"
            value={totalBookings}
            icon={TrendingUp}
            isLoading={bookingsLoading}
            color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          />
          <StatCard
            title="Chờ xác nhận"
            value={pendingCount}
            icon={Clock}
            isLoading={bookingsLoading}
            color="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
          />
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <BedDouble className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 dark:text-slate-100">Quản lý chỗ ở</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Xem, sửa và thêm mới</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/host/listings">Xem</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 dark:text-slate-100">Quản lý booking</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Xác nhận / từ chối đặt phòng</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/host/bookings">Xem</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Đặt phòng gần đây</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/host/bookings">Xem tất cả</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {bookingsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-xl" />
                ))}
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <CalendarCheck className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>Chưa có đặt phòng nào</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 dark:text-slate-100 truncate">
                        {booking.listing.title}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {booking.guest.name} · {new Date(booking.checkIn).toLocaleDateString("vi-VN")} –{" "}
                        {new Date(booking.checkOut).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <Badge variant={statusVariant[booking.status]}>
                      {statusLabel[booking.status] ?? booking.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
