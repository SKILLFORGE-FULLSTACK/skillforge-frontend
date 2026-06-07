"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "../api/notifications";
import { useAuthStore } from "../stores/authStore";

export function useNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationsApi.list(),
    enabled: isAuthenticated,
    refetchInterval: 30 * 1000,
    staleTime: 20 * 1000,
  });
}

export function useMarkRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
