export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar_url: string | null;
  role: "developer" | "recruiter" | "admin";
  plan: "free" | "starter" | "pro" | "expert";
  xp_total: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  is_available: boolean;
  is_public: boolean;
  created_at: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: "developer" | "recruiter";
  company_name?: string;
}
