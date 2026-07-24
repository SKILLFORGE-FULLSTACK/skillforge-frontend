export interface InterviewCategory {
  id: string;
  key: string;
  label: string;
  description: string | null;
  default_difficulty: "easy" | "medium" | "hard" | "expert";
  stack_focus: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface InterviewCategoryPayload {
  key: string;
  label: string;
  description?: string;
  default_difficulty: "easy" | "medium" | "hard" | "expert";
  stack_focus?: string;
  is_active?: boolean;
  sort_order?: number;
}
