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
};
