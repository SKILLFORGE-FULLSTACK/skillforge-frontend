"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { forumApi } from "../api/forum";
import { toast } from "sonner";

export function useForumPosts(params?: {
  search?: string;
  tag?: string;
  sort?: string;
  page?: number;
}) {
  return useQuery({
    queryKey: ["forum", params],
    queryFn: () => forumApi.list(params),
    staleTime: 60 * 1000,
  });
}

export function useForumPost(id: string) {
  return useQuery({
    queryKey: ["forum", id],
    queryFn: () => forumApi.show(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { title: string; body: string; tags?: string[] }) =>
      forumApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum"] });
      toast.success("Question publiée !");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors de la publication");
    },
  });
}

export function useAddComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: string) => forumApi.addComment(postId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum", postId] });
      toast.success("Réponse ajoutée !");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors de l'ajout");
    },
  });
}

export function useVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      type,
      id,
      value,
    }: {
      type: "post" | "comment";
      id: string;
      value: 1 | -1 | 0;
    }) => forumApi.vote(type, id, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum"] });
    },
  });
}
