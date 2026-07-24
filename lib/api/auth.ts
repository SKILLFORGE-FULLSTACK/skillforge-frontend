import apiClient from "./client";
import { AuthResponse, LoginPayload, RegisterPayload, User } from "../types";

export type OAuthProvider = "google" | "github";

/**
 * URL de redirection vers le flow OAuth backend (Socialite).
 * Navigation plein-écran (pas d'appel XHR) : le backend redirige ensuite
 * vers le provider, puis vers /auth/callback côté frontend avec le token.
 *
 * `role`/`companyName` ne sont utilisés que pour une NOUVELLE inscription —
 * ignorés si l'email est déjà associé à un compte existant.
 */
export const getOAuthRedirectUrl = (
  provider: OAuthProvider,
  options?: { role?: "developer" | "recruiter"; companyName?: string },
): string => {
  const params = new URLSearchParams();
  if (options?.role) params.set("role", options.role);
  if (options?.companyName) params.set("company_name", options.companyName);
  const query = params.toString();
  return `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}/redirect${query ? `?${query}` : ""}`;
};

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
