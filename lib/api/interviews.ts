import apiClient from "./client";
import {
  InterviewSession,
  RespondResult,
  StartInterviewPayload,
  PaginatedResponse,
} from "../types";

export const interviewApi = {
  start: async (payload: StartInterviewPayload): Promise<InterviewSession> => {
    const { data } = await apiClient.post<{ session: InterviewSession }>(
      "/interviews/start",
      payload,
    );
    return data.session;
  },

  respond: async (
    sessionId: string,
    payload: {
      question_id: string;
      text_answer?: string;
      code_submitted?: string;
      language?: string;
      time_taken_sec?: number;
    },
  ): Promise<RespondResult> => {
    const { data } = await apiClient.post<RespondResult>(
      `/interviews/${sessionId}/respond`,
      payload,
    );
    return data;
  },

  hint: async (
    sessionId: string,
    questionId: string,
    partialAnswer?: string,
  ): Promise<string> => {
    const { data } = await apiClient.post<{ hint: string }>(
      `/interviews/${sessionId}/hint`,
      { question_id: questionId, partial_answer: partialAnswer },
    );
    return data.hint;
  },

  complete: async (sessionId: string) => {
    const { data } = await apiClient.post(`/interviews/${sessionId}/complete`);
    return data;
  },

  getReport: async (sessionId: string) => {
    const { data } = await apiClient.get(`/interviews/${sessionId}/report`);
    return data.report;
  },

  getSession: async (sessionId: string): Promise<InterviewSession> => {
    const { data } = await apiClient.get<{ session: InterviewSession }>(
      `/interviews/${sessionId}`,
    );
    return data.session;
  },

  getHistory: async (params?: {
    type?: string;
    status?: string;
    page?: number;
  }): Promise<PaginatedResponse<InterviewSession>> => {
    const { data } = await apiClient.get("/interviews", { params });
    return data;
  },
};
