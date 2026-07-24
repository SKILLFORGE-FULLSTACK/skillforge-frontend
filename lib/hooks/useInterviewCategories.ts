"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { interviewCategoriesApi } from "../api";
import { InterviewCategoryPayload } from "../types";

export function useInterviewCategories() {
  return useQuery({
    queryKey: ["interview-categories"],
    queryFn: () => interviewCategoriesApi.list(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminInterviewCategories() {
  return useQuery({
    queryKey: ["admin-interview-categories"],
    queryFn: () => interviewCategoriesApi.adminList(),
  });
}

export function useCreateInterviewCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: InterviewCategoryPayload) => interviewCategoriesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-interview-categories"] });
      queryClient.invalidateQueries({ queryKey: ["interview-categories"] });
      toast.success("Catégorie créée.");
    },
    onError: (error: any) => {
      const errors = error.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach((msg: any) => toast.error(msg));
      } else {
        toast.error(error.response?.data?.message || "Erreur lors de la création.");
      }
    },
  });
}

export function useUpdateInterviewCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: InterviewCategoryPayload }) =>
      interviewCategoriesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-interview-categories"] });
      queryClient.invalidateQueries({ queryKey: ["interview-categories"] });
      toast.success("Catégorie mise à jour.");
    },
    onError: (error: any) => {
      const errors = error.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach((msg: any) => toast.error(msg));
      } else {
        toast.error(error.response?.data?.message || "Erreur lors de la mise à jour.");
      }
    },
  });
}

export function useDeleteInterviewCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => interviewCategoriesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-interview-categories"] });
      queryClient.invalidateQueries({ queryKey: ["interview-categories"] });
      toast.success("Catégorie supprimée.");
    },
    onError: () => toast.error("Erreur lors de la suppression."),
  });
}
