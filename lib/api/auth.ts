import apiClient from "./client";
import { AuthResponse, LoginPayload, RegisterPayload, User } from "../types";

export const authApi = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(
      "/auth/register",
      payload,
    );
    return data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  me: async (): Promise<User> => {
    const { data } = await apiClient.get<{ user: User }>("/me");
    return data.user;
  },
};
