import apiClient from "./client";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  xp_reward: number;
  ends_at: string;
  participants_count: number;
  user_submission: {
    score: number;
    submitted_at: string;
    rank: number | null;
  } | null;
}

export interface ChallengeLeaderboardEntry {
  rank: number;
  user: {
    id: string;
    name: string;
    username: string;
    avatar_url: string | null;
  };
  score: number;
  submitted_at: string;
}

export const challengesApi = {
  current: async (): Promise<Challenge | null> => {
    const { data } = await apiClient.get<{ challenge: Challenge | null }>("/challenges/current");
    return data.challenge;
  },

  submit: async (
    challengeId: string,
    payload: { code?: string; answer?: string; language?: string }
  ) => {
    const { data } = await apiClient.post(`/challenges/${challengeId}/submit`, payload);
    return data;
  },

  leaderboard: async (challengeId: string): Promise<ChallengeLeaderboardEntry[]> => {
    const { data } = await apiClient.get<{ leaderboard: ChallengeLeaderboardEntry[] }>(
      `/challenges/${challengeId}/leaderboard`
    );
    return data.leaderboard;
  },
};
