import { create } from "zustand";
import { InterviewQuestion, InterviewSession, RespondResult } from "../types";

interface InterviewState {
  currentSession: InterviewSession | null;
  currentQuestion: InterviewQuestion | null;
  lastResult: RespondResult | null;
  isLoading: boolean;
  isSubmitting: boolean;

  // Actions
  setSession: (session: InterviewSession) => void;
  setQuestion: (question: InterviewQuestion) => void;
  setResult: (result: RespondResult) => void;
  setLoading: (loading: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
  clearSession: () => void;
}

export const useInterviewStore = create<InterviewState>((set) => ({
  currentSession: null,
  currentQuestion: null,
  lastResult: null,
  isLoading: false,
  isSubmitting: false,

  setSession: (session) =>
    set({
      currentSession: session,
      currentQuestion: session.current_question,
    }),

  setQuestion: (question) => set({ currentQuestion: question }),

  setResult: (result) =>
    set((state) => ({
      lastResult: result,
      currentQuestion: result.next_question ?? null,
      currentSession: state.currentSession
        ? { ...state.currentSession, progress: result.progress }
        : null,
    })),

  setLoading: (loading) => set({ isLoading: loading }),
  setSubmitting: (submitting) => set({ isSubmitting: submitting }),

  clearSession: () =>
    set({
      currentSession: null,
      currentQuestion: null,
      lastResult: null,
    }),
}));
