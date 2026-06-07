export interface InterviewQuestion {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: "easy" | "medium" | "hard" | "expert";
  constraints: string | null;
  examples: Array<{
    input: string;
    output: string;
    explanation: string;
  }>;
  hints_count: number;
  stack: string[];
}

export interface InterviewSession {
  id: string;
  type: string;
  mode: string;
  difficulty: string;
  stack_focus: string | null;
  company_target: string | null;
  duration_min: number;
  status: "in_progress" | "completed" | "abandoned";
  score_total: number | null;
  questions_count: number;
  hints_used: number;
  xp_earned: number;
  started_at: string;
  completed_at: string | null;
  progress: {
    current: number;
    total: number;
  };
  current_question: InterviewQuestion | null;
}

export interface RespondResult {
  score: number;
  verdict: string;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  model_answer: string;
  execution: ExecutionResult | null;
  next_question: InterviewQuestion | null;
  is_last: boolean;
  progress: { current: number; total: number };
}

export interface ExecutionResult {
  status: string;
  stdout: string | null;
  stderr: string | null;
  time_ms: number | null;
  memory_kb: number | null;
  success: boolean;
}

export interface StartInterviewPayload {
  type: string;
  difficulty?: string;
  stack_focus?: string;
  company_target?: string;
  duration_min?: number;
  mode?: string;
}
