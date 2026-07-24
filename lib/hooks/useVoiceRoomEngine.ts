"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { voiceInterviewApi } from "../api";
import { useVoiceInterviewStore } from "../stores/voiceInterviewStore";
import { encodeWav } from "../utils/wavEncoder";
import { useT } from "../i18n/useTranslation";

// Type minimal de l'instance MicVAD (import dynamique, la lib ne doit jamais être
// évaluée côté serveur car elle touche au micro/AudioContext du navigateur).
interface MicVadInstance {
  start: () => Promise<void>;
  pause: () => Promise<void>;
  destroy: () => Promise<void>;
}

/**
 * Orchestre la salle d'entretien vocal en direct : détection automatique de silence
 * (VAD) pour capturer la voix du candidat, envoi au backend, lecture de la réponse
 * IA, puis reprise de l'écoute. Utilisé par la page /dashboard/interviews/voice/[id].
 */
export function useVoiceRoomEngine(roomId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useT();
  const { room, turns, callState, progress, setRoom, appendTurns, setCallState, setProgress } =
    useVoiceInterviewStore();

  const vadRef = useRef<MicVadInstance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const openingPlayedForRoomRef = useRef<string | null>(null);

  const [micError, setMicError] = useState<string | null>(null);
  const [isEngineReady, setIsEngineReady] = useState(false);

  // ─── Charger la salle si on arrive directement sur l'URL (refresh, ou
  // salle différente de celle déjà en mémoire depuis une session précédente) ──
  const isDifferentOrMissingRoom = room?.id !== roomId;

  const { data: fetchedRoom, isLoading: isLoadingRoom } = useQuery({
    queryKey: ["voice-interview", roomId],
    queryFn: () => voiceInterviewApi.getRoom(roomId),
    enabled: !!roomId && isDifferentOrMissingRoom,
  });

  useEffect(() => {
    if (fetchedRoom && isDifferentOrMissingRoom) {
      setRoom(fetchedRoom, fetchedRoom.turns);
    }
  }, [fetchedRoom, isDifferentOrMissingRoom, setRoom]);

  // ─── Jouer un tour audio de l'IA, puis reprendre l'écoute ───────────
  const playAiTurn = useCallback(
    (audioUrl: string | null, isFinal: boolean) => {
      setCallState("ai_speaking");
      vadRef.current?.pause();

      const resumeOrEnd = () => {
        if (isFinal) {
          setCallState("ended");
          vadRef.current?.pause();
        } else {
          setCallState("listening");
          vadRef.current?.start();
        }
      };

      if (!audioUrl) {
        resumeOrEnd();
        return;
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = resumeOrEnd;
      audio.onerror = resumeOrEnd;
      audio.play().catch(resumeOrEnd);
    },
    [setCallState],
  );

  // ─── Soumettre le tour du candidat (audio capturé par le VAD) ───────
  const turnMutation = useMutation({
    mutationFn: (audioBlob: Blob) => voiceInterviewApi.submitTurn(roomId, audioBlob),
    onSuccess: (result) => {
      appendTurns([result.candidate_turn, result.ai_turn]);
      setProgress(result.progress);
      playAiTurn(result.ai_turn.audio_url, result.is_final);
    },
    onError: () => {
      toast.error(t("voiceInterview.turnErrorToast"));
      setCallState("listening");
      vadRef.current?.start();
    },
  });

  // ─── Terminer la salle et générer le rapport ─────────────────────────
  const completeMutation = useMutation({
    mutationFn: () => voiceInterviewApi.complete(roomId),
    onSuccess: (completedRoom) => {
      setRoom(completedRoom, completedRoom.turns);
      vadRef.current?.destroy();
      vadRef.current = null;
      queryClient.invalidateQueries({ queryKey: ["voice-interviews"] });
      router.push(`/dashboard/interviews/voice/${completedRoom.id}/report`);
    },
    onError: () => toast.error(t("voiceInterview.reportErrorToast")),
  });

  // ─── Initialiser le VAD (demande la permission micro) ────────────────
  const initEngine = useCallback(async () => {
    if (vadRef.current || isEngineReady) return;

    try {
      const { MicVAD } = await import("@ricky0123/vad-web");
      const vad = await MicVAD.new({
        baseAssetPath: "/vad/",
        onnxWASMBasePath: "/vad/",
        model: "v5",
        startOnLoad: false,
        onSpeechEnd: (audio: Float32Array) => {
          setCallState("processing");
          turnMutation.mutate(encodeWav(audio, 16000));
        },
      });

      vadRef.current = vad;
      setIsEngineReady(true);
    } catch (e) {
      setMicError(t("voiceInterview.micErrorMessage"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEngineReady, t]);

  // ─── Jouer l'accroche IA dès que le moteur est prêt ──────────────────
  useEffect(() => {
    if (
      isEngineReady &&
      room?.id === roomId &&
      openingPlayedForRoomRef.current !== roomId &&
      turns.length > 0 &&
      callState === "idle" &&
      room?.status === "in_progress"
    ) {
      openingPlayedForRoomRef.current = roomId;
      const lastTurn = turns[turns.length - 1];
      playAiTurn(lastTurn.audio_url, false);
    }
  }, [isEngineReady, turns, callState, room, roomId, playAiTurn]);

  // ─── Nettoyage ────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      vadRef.current?.destroy();
      vadRef.current = null;
      audioRef.current?.pause();
    };
  }, []);

  return {
    room,
    turns,
    callState,
    progress,
    micError,
    isEngineReady,
    isLoadingRoom,
    isSubmittingTurn: turnMutation.isPending,
    isCompleting: completeMutation.isPending,
    initEngine,
    completeRoom: completeMutation.mutate,
  };
}
