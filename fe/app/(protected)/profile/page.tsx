"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, Mail, User as UserIcon, Shield } from "lucide-react";
import { authApi } from "@/features/auth/api/authApi";
import { useAuth } from "@/features/auth/hooks/useAuth";

const ROLE_LABEL: Record<string, string> = {
  GUEST: "Khách",
  HOST: "Chủ nhà",
  ADMIN: "Quản trị",
};

export default function ProfilePage() {
  const { logout } = useAuth();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["users", "me"],
    queryFn: authApi.getMe,
    retry: false,
  });

  if (isError) {
    toast.error("Không thể tải thông tin người dùng");
  }

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0].toUpperCase() ?? "?";

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          {isLoading ? (
            <>
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-28" />
              </div>
            </>
          ) : (
            <>
              <Avatar className="h-16 w-16 text-lg">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <CardTitle>{user?.name ?? "Chưa cập nhật tên"}</CardTitle>
                <Badge variant="secondary">
                  {ROLE_LABEL[user?.role ?? "GUEST"]}
                </Badge>
              </div>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <UserIcon className="h-4 w-4 shrink-0" />
                <span>ID: {user?.id}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 shrink-0" />
                <span>Vai trò: {ROLE_LABEL[user?.role ?? "GUEST"]}</span>
              </div>
            </>
          )}

          <div className="pt-4">
            <Button
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
