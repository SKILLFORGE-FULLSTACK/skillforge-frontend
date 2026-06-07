"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "../api";
import { useAuthStore } from "../stores/authStore";
import { LoginPayload, RegisterPayload } from "../types";
import { toast } from "sonner";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    setAuth,
    logout: logoutStore,
    user,
    isAuthenticated,
  } = useAuthStore();

  // Login
  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success("Connexion réussie !");

      // Redirection selon le rôle
      if (data.user.role === "recruiter") {
        router.push("/recruiter/dashboard");
      } else {
        router.push("/dashboard");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Identifiants incorrects");
    },
  });

  // Register
  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success("Compte créé avec succès !");

      if (data.user.role === "recruiter") {
        router.push("/recruiter/dashboard");
      } else {
        router.push("/dashboard");
      }
    },
    onError: (error: any) => {
      const errors = error.response?.data?.errors;
      if (errors) {
        Object.values(errors)
          .flat()
          .forEach((msg: any) => toast.error(msg));
      } else {
        toast.error(
          error.response?.data?.message || "Erreur lors de l'inscription",
        );
      }
    },
  });

  // Logout
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      logoutStore();
      queryClient.clear();
      router.push("/login");
      toast.success("Déconnexion réussie");
    },
  });

  // Get current user
  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ["me"],
    queryFn: () => authApi.me(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user: currentUser || user,
    isAuthenticated,
    isLoadingUser,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
}
