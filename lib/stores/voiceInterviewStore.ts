import { create } from "zustand";
import { VoiceInterviewRoom, VoiceInterviewTurn } from "../types";

export type VoiceCallState = "idle" | "listening" | "processing" | "ai_speaking" | "ended";

interface VoiceInterviewState {
  room: VoiceInterviewRoom | null;
  turns: VoiceInterviewTurn[];
  callState: VoiceCallState;
  progress: { current: number; total: number } | null;

  setRoom: (room: VoiceInterviewRoom, initialTurns?: VoiceInterviewTurn[]) => void;
  appendTurns: (turns: VoiceInterviewTurn[]) => void;
  setCallState: (state: VoiceCallState) => void;
  setProgress: (progress: { current: number; total: number }) => void;
  reset: () => void;
}

export const useVoiceInterviewStore = create<VoiceInterviewState>((set) => ({
  room: null,
  turns: [],
  callState: "idle",
  progress: null,

  setRoom: (room, initialTurns) =>
    set({ room, turns: initialTurns ?? room.turns ?? [] }),

  appendTurns: (newTurns) =>
    set((state) => ({ turns: [...state.turns, ...newTurns] })),

  setCallState: (callState) => set({ callState }),

  setProgress: (progress) => set({ progress }),

  reset: () => set({ room: null, turns: [], callState: "idle", progress: null }),
}));
