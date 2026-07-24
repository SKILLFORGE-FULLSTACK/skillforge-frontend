"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { marketplaceApi } from "../api/marketplace";
import { SearchFilters } from "../types";
import { toast } from "sonner";

export function useDevelopers(filters: SearchFilters) {
  return useQuery({
    queryKey: ["developers", filters],
    queryFn: () => marketplaceApi.searchDevelopers(filters),
    staleTime: 2 * 60 * 1000,
  });
}

export function useDeveloper(username: string) {
  return useQuery({
    queryKey: ["developer", username],
    queryFn: () => marketplaceApi.getDeveloper(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSavedProfiles() {
  return useQuery({
    queryKey: ["saved-profiles"],
    queryFn: () => marketplaceApi.getSaved(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useSaveProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ developerId, note }: { developerId: string; note?: string }) =>
      marketplaceApi.saveProfile(developerId, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["developers"] });
      toast.success("Profil sauvegardé !");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors de la sauvegarde");
    },
  });
}

export function useUnsaveProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (developerId: string) => marketplaceApi.unsaveProfile(developerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["developers"] });
      toast.success("Profil retiré des favoris");
    },
  });
}

export function useContactDeveloper() {
  return useMutation({
    mutationFn: (payload: {
      developer_id: string;
      message: string;
      job_posting_id?: string;
    }) => marketplaceApi.contactDeveloper(payload),
    onSuccess: () => {
      toast.success("Message envoyé !");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors de l'envoi");
    },
  });
}

export function useJobs(filters?: {
  search?: string;
  contract_type?: string;
  work_mode?: string;
  per_page?: number;
  mine?: boolean;
}) {
  return useQuery({
    queryKey: ["jobs", filters],
    queryFn: () => marketplaceApi.getJobs(filters),
    staleTime: 2 * 60 * 1000,
  });
}

export function useJob(id: string | undefined) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => marketplaceApi.getJob(id as string),
    enabled: !!id,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      title: string;
      description: string;
      contract_type: string;
      work_mode: string;
      min_level?: string;
      salary_min?: number;
      salary_max?: number;
      location?: string;
    }) => marketplaceApi.createJob(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Offre d'emploi créée !");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors de la création");
    },
  });
}
