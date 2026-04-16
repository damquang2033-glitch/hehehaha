import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { authApi } from "@/features/auth/api/authApi";

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Token đã hết hạn hoặc invalid — vẫn clear local state
    } finally {
      clearAuth();
      toast.success("Đã đăng xuất");
      router.push("/auth/login");
    }
  };

  return { user, isAuthenticated, logout };
}
