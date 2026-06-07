import apiClient from "./client";
import { PaginatedResponse } from "../types";

export interface ForumPost {
  id: string;
  title: string;
  body: string;
  tags: string[];
  votes: number;
  views: number;
  answers_count: number;
  has_accepted_answer: boolean;
  is_pinned: boolean;
  created_at: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar_url: string | null;
    level: number;
  };
  user_vote: number | null;
}

export interface ForumComment {
  id: string;
  body: string;
  votes: number;
  is_accepted: boolean;
  created_at: string;
  user_vote: number | null;
  author: {
    id: string;
    name: string;
    username: string;
    avatar_url: string | null;
    level: number;
  };
}

export interface ForumPostDetail extends ForumPost {
  comments: ForumComment[];
}

export const forumApi = {
  list: async (params?: {
    search?: string;
    tag?: string;
    sort?: string;
    page?: number;
  }): Promise<PaginatedResponse<ForumPost>> => {
    const { data } = await apiClient.get("/forum", { params });
    return data;
  },

  show: async (id: string): Promise<ForumPostDetail> => {
    const { data } = await apiClient.get<{ post: ForumPostDetail }>(`/forum/${id}`);
    return data.post;
  },

  create: async (payload: { title: string; body: string; tags?: string[] }): Promise<ForumPost> => {
    const { data } = await apiClient.post<{ post: ForumPost }>("/forum", payload);
    return data.post;
  },

  addComment: async (postId: string, body: string): Promise<ForumComment> => {
    const { data } = await apiClient.post<{ comment: ForumComment }>(
      `/forum/${postId}/comments`,
      { body }
    );
    return data.comment;
  },

  vote: async (type: "post" | "comment", id: string, value: 1 | -1 | 0) => {
    const { data } = await apiClient.post(`/forum/${type}/${id}/vote`, { value });
    return data;
  },

  acceptAnswer: async (commentId: string) => {
    const { data } = await apiClient.post(`/forum/comments/${commentId}/accept`);
    return data;
  },
};
