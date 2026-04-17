"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { LogOut, Mail, User as UserIcon, Shield, Pencil, Loader2, Lock } from "lucide-react";
import { authApi } from "@/features/auth/api/authApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";

const ROLE_LABEL: Record<string, string> = {
  GUEST: "Khách",
  HOST: "Chủ nhà",
  ADMIN: "Quản trị",
};

const profileSchema = z.object({
  name: z.string().max(100).optional().or(z.literal("")),
  avatar: z.string().url("URL không hợp lệ").optional().or(z.literal("")),
});

const passwordSchema = z.object({
  oldPassword: z.string().min(1, "Bắt buộc"),
  newPassword: z.string().min(6, "Tối thiểu 6 ký tự"),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [editingProfile, setEditingProfile] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ["users", "me"],
    queryFn: authApi.getMe,
    retry: false,
  });

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name ?? "", avatar: user?.avatar ?? "" },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const updateProfileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (updated) => {
      queryClient.setQueryData(["users", "me"], updated);
      toast.success("Cập nhật thành công!");
      setEditingProfile(false);
    },
    onError: () => toast.error("Cập nhật thất bại. Vui lòng thử lại."),
  });

  const changePasswordMutation = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công!");
      passwordForm.reset();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      toast.error(msg ?? "Đổi mật khẩu thất bại.");
    },
  });

  const handleProfileSubmit = (values: ProfileValues) => {
    updateProfileMutation.mutate({
      name: values.name || undefined,
      avatar: values.avatar || undefined,
    });
  };

  const handlePasswordSubmit = (values: PasswordValues) => {
    changePasswordMutation.mutate({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    });
  };

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0].toUpperCase() ?? "?";

  return (
    <div className="container max-w-2xl py-10 space-y-6">
      {/* Profile info */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
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
                  <AvatarImage src={user?.avatar ?? undefined} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <CardTitle>{user?.name ?? "Chưa cập nhật tên"}</CardTitle>
                  <Badge variant="secondary">{ROLE_LABEL[user?.role ?? "GUEST"]}</Badge>
                </div>
              </>
            )}
          </div>
          {!isLoading && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingProfile((v) => !v)}
              className="gap-1.5 shrink-0"
            >
              <Pencil className="h-3.5 w-3.5" />
              {editingProfile ? "Hủy" : "Chỉnh sửa"}
            </Button>
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

          {/* Edit profile form */}
          {editingProfile && (
            <>
              <Separator className="my-2" />
              <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên hiển thị</Label>
                  <Input id="name" placeholder="Nguyễn Văn A" {...profileForm.register("name")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatar">URL ảnh đại diện</Label>
                  <Input id="avatar" placeholder="https://..." {...profileForm.register("avatar")} />
                  {profileForm.formState.errors.avatar && (
                    <p className="text-sm text-red-500">{profileForm.formState.errors.avatar.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                >
                  {updateProfileMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Lưu thay đổi
                </Button>
              </form>
            </>
          )}

          <Separator className="my-2" />
          <Button variant="destructive" className="w-full sm:w-auto" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </Button>
        </CardContent>
      </Card>

      {/* Change password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lock className="h-5 w-5 text-orange-500" />
            Đổi mật khẩu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Mật khẩu hiện tại</Label>
              <Input id="oldPassword" type="password" {...passwordForm.register("oldPassword")} />
              {passwordForm.formState.errors.oldPassword && (
                <p className="text-sm text-red-500">{passwordForm.formState.errors.oldPassword.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <Input id="newPassword" type="password" {...passwordForm.register("newPassword")} />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-sm text-red-500">{passwordForm.formState.errors.newPassword.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
              <Input id="confirmPassword" type="password" {...passwordForm.register("confirmPassword")} />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-sm text-red-500">{passwordForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={changePasswordMutation.isPending}
              variant="outline"
              className="border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              {changePasswordMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Đổi mật khẩu
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
