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
    const { data } = await apiClient.get<{ stats: UserStats }>("/me/stats");
    return data.stats;
  },

  updateStreak: async (): Promise<{ streak: number; xp_earned: number }> => {
    const { data } = await apiClient.post<{ streak: number; xp_earned: number }>("/me/streak");
    return data;
  },

  xpHistory: async (): Promise<XpHistoryEntry[]> => {
    const { data } = await apiClient.get<{ history: XpHistoryEntry[] }>("/me/xp-history");
    return data.history;
  },

  activityHeatmap: async (): Promise<ActivityEntry[]> => {
    const { data } = await apiClient.get<{ activity: ActivityEntry[] }>("/me/activity");
    return data.activity;
  },

  leaderboard: async (params?: { period?: string; page?: number }) => {
    const { data } = await apiClient.get("/leaderboard", { params });
    return data;
  },
};
