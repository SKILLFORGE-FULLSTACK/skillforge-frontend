import apiClient from "./client";

export interface UserStats {
  xp_total: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  global_score: number;
  interview_score: number | null;
  cert_score: number | null;
  interviews_completed: number;
  certifications_passed: number;
  rank: number | null;
  badges_count: number;
}

export interface XpHistoryEntry {
  date: string;
  xp: number;
  source: string;
  description: string;
}

export interface ActivityEntry {
  date: string;
  count: number;
}

export const statsApi = {
  myStats: async (): Promise<UserStats> => {
    const { data } = await apiClient.get("/me/stats");
    return (data.stats ?? data) as UserStats;
  },

  updateStreak: async (): Promise<{ streak: number; xp_earned: number }> => {
    const { data } = await apiClient.post("/me/streak");
    return data;
  },

  xpHistory: async (): Promise<XpHistoryEntry[]> => {
    const { data } = await apiClient.get("/me/xp-history");
    const raw = data.history ?? data;
    return Array.isArray(raw) ? (raw as XpHistoryEntry[]) : [];
  },

  activityHeatmap: async (): Promise<ActivityEntry[]> => {
    const { data } = await apiClient.get("/me/activity");
    const raw = data.activity ?? data;
    if (Array.isArray(raw)) return raw as ActivityEntry[];
    // API may return { "2024-01-01": 3, ... }
    if (raw && typeof raw === "object") {
      return Object.entries(raw).map(([date, count]) => ({ date, count: Number(count) }));
    }
    return [];
  },

  leaderboard: async (params?: { period?: string; page?: number }) => {
    const { data } = await apiClient.get("/leaderboard", { params });
    return data;
  },
};
