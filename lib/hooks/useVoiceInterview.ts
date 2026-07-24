"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { voiceInterviewApi } from "../api";
import { useVoiceInterviewStore } from "../stores/voiceInterviewStore";
import { StartVoiceInterviewPayload } from "../types";

export function useVoiceInterview() {
  const router = useRouter();
  const setRoom = useVoiceInterviewStore((state) => state.setRoom);
  const reset = useVoiceInterviewStore((state) => state.reset);

  const startMutation = useMutation({
    mutationFn: (payload: StartVoiceInterviewPayload) => voiceInterviewApi.start(payload),
    onSuccess: ({ room, turn }) => {
      setRoom(room, [turn]);
      router.push(`/dashboard/interviews/voice/${room.id}`);
    },
    onError: (error: any) => {
      const quotaError = error?.response?.data?.errors?.quota?.[0];
      toast.error(quotaError || "Impossible de démarrer l'entretien vocal.");
    },
  });

  const useHistory = (params?: { page?: number }) =>
    useQuery({
      queryKey: ["voice-interviews", params],
      queryFn: () => voiceInterviewApi.getHistory(params),
    });

  const useRoom = (roomId: string | undefined) =>
    useQuery({
      queryKey: ["voice-interview", roomId],
      queryFn: () => voiceInterviewApi.getRoom(roomId as string),
      enabled: !!roomId,
    });

  return {
    startRoom: startMutation.mutate,
    isStarting: startMutation.isPending,
    resetRoom: reset,
    useHistory,
    useRoom,
  };
}
