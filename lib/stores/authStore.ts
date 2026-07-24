import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "../types";

// Le middleware Next.js (middleware.ts) lit ce cookie côté edge pour protéger
// les routes — il doit rester en phase avec le token stocké en localStorage.
const TOKEN_COOKIE_NAME = "skillforge_token";
const TOKEN_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 jours

function setTokenCookie(token: string) {
  document.cookie = `${TOKEN_COOKIE_NAME}=${token}; path=/; max-age=${TOKEN_COOKIE_MAX_AGE}; SameSite=Lax`;
}

function clearTokenCookie() {
  document.cookie = `${TOKEN_COOKIE_NAME}=; path=/; max-age=0`;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (user: User, token: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        localStorage.setItem("skillforge_token", token);
        setTokenCookie(token);
        set({ user, token, isAuthenticated: true });
      },

      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),

      logout: () => {
        localStorage.removeItem("skillforge_token");
        localStorage.removeItem("skillforge_user");
        clearTokenCookie();
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "skillforge_user",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
