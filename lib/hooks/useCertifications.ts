"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { certificationsApi } from "../api/certifications";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useCertifications() {
  return useQuery({
    queryKey: ["certifications"],
    queryFn: () => certificationsApi.list(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCertification(slug: string) {
  return useQuery({
    queryKey: ["certifications", slug],
    queryFn: () => certificationsApi.show(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMySubmissions() {
  return useQuery({
    queryKey: ["my-submissions"],
    queryFn: () => certificationsApi.mySubmissions(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useStartCertification() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (slug: string) => certificationsApi.start(slug),
    onSuccess: (submission) => {
      queryClient.invalidateQueries({ queryKey: ["my-submissions"] });
      toast.success("Certification démarrée !");
      router.push(`/dashboard/certifications/${submission.certification.slug}`);
    },
    onError: (error: any, slug: string) => {
      const status = error.response?.status;
      const message: string = error.response?.data?.message ?? "";
      // Backend renvoie 409 ou un message "already" quand déjà démarrée → naviguer directement
      if (status === 409 || message.toLowerCase().includes("already") || message.toLowerCase().includes("déjà")) {
        toast.info("Certification déjà en cours, redirection...");
        router.push(`/dashboard/certifications/${slug}`);
      } else {
        toast.error(message || "Erreur lors du démarrage");
      }
    },
  });
}

export function useSubmitWork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      submissionId,
      payload,
    }: {
      submissionId: string;
      payload: { github_url: string; live_url?: string; notes?: string };
    }) => certificationsApi.submitWork(submissionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-submissions"] });
      toast.success("Projet soumis avec succès !");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors de la soumission");
    },
  });
}
