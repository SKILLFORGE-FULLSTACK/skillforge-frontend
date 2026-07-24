export type VoiceInterviewMode = "practice" | "job_interview";
export type VoiceInterviewStatus = "in_progress" | "completed" | "abandoned";
export type VoiceTurnSpeaker = "candidate" | "ai";
export type VoiceInterviewLanguage = "fr" | "en";

export interface VoiceInterviewTurn {
  id: string;
  order: number;
  speaker: VoiceTurnSpeaker;
  transcript: string | null;
  audio_url: string | null;
  created_at: string;
}

export interface VoiceInterviewReport {
  score: number;
  overall_feedback: string;
  strengths: string[];
  improvement_areas: string[];
  resources: Array<{ title: string; type: string; topic: string }>;
  readiness_level: "not_ready" | "almost_ready" | "ready" | "senior_ready";
  estimated_weeks_to_improve: number | null;
}

export interface VoiceInterviewRoom {
  id: string;
  mode: VoiceInterviewMode;
  status: VoiceInterviewStatus;
  language: VoiceInterviewLanguage;
  score_total: number | null;
  ai_feedback: string | null;
  score_breakdown: { report?: VoiceInterviewReport; duration_sec?: number } | null;
  xp_earned: number;
  started_at: string;
  completed_at: string | null;
  job_posting: { id: string; title: string; company_name: string | null } | null;
  // Présent uniquement quand la relation est chargée côté backend (show/complete) —
  // absent sur start()/index(), où il faut reconstituer les tours manuellement.
  turns?: VoiceInterviewTurn[];
}

export interface StartVoiceInterviewPayload {
  job_posting_id?: string;
  language?: VoiceInterviewLanguage;
}

export interface VoiceInterviewTurnResult {
  candidate_turn: VoiceInterviewTurn;
  ai_turn: VoiceInterviewTurn;
  is_final: boolean;
  progress: { current: number; total: number };
}
