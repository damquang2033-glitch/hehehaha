export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: "GUEST" | "HOST" | "ADMIN";
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}
