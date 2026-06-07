"use client";

import { useQuery } from "@tanstack/react-query";
import { statsApi } from "../api/stats";
import { useAuthStore } from "../stores/authStore";

export function useMyStats() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["my-stats"],
    queryFn: () => statsApi.myStats(),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });
}

export function useActivityHeatmap() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["activity-heatmap"],
    queryFn: () => statsApi.activityHeatmap(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}

export function useXpHistory() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["xp-history"],
    queryFn: () => statsApi.xpHistory(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLeaderboard(params?: { period?: string; page?: number }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["leaderboard", params],
    queryFn: () => statsApi.leaderboard(params),
    enabled: isAuthenticated,
    staleTime: 3 * 60 * 1000,
  });
}
