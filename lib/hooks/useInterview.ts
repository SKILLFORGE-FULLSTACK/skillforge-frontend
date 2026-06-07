"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { interviewApi } from "../api";
import { useInterviewStore } from "../stores/interviewStore";
import { StartInterviewPayload } from "../types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useInterview() {
  const router = useRouter();
  const {
    currentSession,
    currentQuestion,
    lastResult,
    setSession,
    setResult,
    clearSession,
  } = useInterviewStore();

  const startMutation = useMutation({
    mutationFn: (payload: StartInterviewPayload) => interviewApi.start(payload),
    onSuccess: (session) => {
      setSession(session);
      router.push("/dashboard/interviews/session");
      toast.success("Session démarrée !");
    },
    onError: () => toast.error("Impossible de démarrer la session"),
  });

  const respondMutation = useMutation({
    mutationFn: ({
      sessionId,
      payload,
    }: {
      sessionId: string;
      payload: {
        question_id: string;
        text_answer?: string;
        code_submitted?: string;
        language?: string;
        time_taken_sec?: number;
      };
    }) => interviewApi.respond(sessionId, payload),
    onSuccess: (result) => {
      setResult(result);
      if (result.is_last) {
        toast.success("Dernière question répondue !");
      }
    },
    onError: () => toast.error("Erreur lors de la soumission"),
  });

  const hintMutation = useMutation({
    mutationFn: ({
      sessionId,
      questionId,
      partialAnswer,
    }: {
      sessionId: string;
      questionId: string;
      partialAnswer?: string;
    }) => interviewApi.hint(sessionId, questionId, partialAnswer),
    onError: () => toast.error("Impossible d'obtenir un indice"),
  });

  const completeMutation = useMutation({
    mutationFn: (sessionId: string) => interviewApi.complete(sessionId),
    onSuccess: (data, sessionId) => {
      toast.success(
        `Session terminée ! Score : ${data.score}/100 — +${data.xp_earned} XP`,
      );
      clearSession();
      router.push(`/dashboard/interviews/${sessionId}/report`);
    },
    onError: () => toast.error("Erreur lors de la finalisation"),
  });

  const useHistory = (params?: { type?: string; status?: string }) =>
    useQuery({
      queryKey: ["interviews", params],
      queryFn: () => interviewApi.getHistory(params),
    });

  const useReport = (sessionId: string) =>
    useQuery({
      queryKey: ["interview-report", sessionId],
      queryFn: () => interviewApi.getReport(sessionId),
      enabled: !!sessionId,
    });

  return {
    currentSession,
    currentQuestion,
    lastResult,
    startSession: startMutation.mutate,
    respond: respondMutation.mutate,
    getHint: hintMutation.mutate,
    complete: completeMutation.mutate,
    hint: hintMutation.data,
    isStarting: startMutation.isPending,
    isResponding: respondMutation.isPending,
    isGettingHint: hintMutation.isPending,
    isCompleting: completeMutation.isPending,
    useHistory,
    useReport,
  };
}
