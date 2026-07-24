export * from "./auth";
export * from "./interview";
export * from "./interviewCategory";
export * from "./marketplace";
export * from "./voiceInterview";

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
