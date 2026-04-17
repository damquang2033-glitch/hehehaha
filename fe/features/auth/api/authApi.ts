import { apiClient } from "@/lib/apiClient";
import { ApiResponse, AuthResponse } from "@/types/auth";

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UpdateProfileInput {
  name?: string;
  avatar?: string;
}

export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
}

export const authApi = {
  register: async (input: RegisterInput) => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      input
    );
    return data.data;
  },

  login: async (input: LoginInput) => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      input
    );
    return data.data;
  },

  logout: async () => {
    await apiClient.post("/auth/logout");
  },

  getMe: async () => {
    const { data } = await apiClient.get<ApiResponse<AuthResponse["user"]>>(
      "/users/me"
    );
    return data.data;
  },

  updateProfile: async (input: UpdateProfileInput) => {
    const { data } = await apiClient.patch<ApiResponse<AuthResponse["user"]>>(
      "/users/me",
      input
    );
    return data.data;
  },

  changePassword: async (input: ChangePasswordInput) => {
    await apiClient.patch("/users/me/password", input);
  },

  becomeHost: async () => {
    const { data } = await apiClient.patch<ApiResponse<AuthResponse["user"]>>(
      "/users/me/become-host"
    );
    return data.data;
  },
};
