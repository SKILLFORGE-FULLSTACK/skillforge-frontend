import apiClient from "./client";
import {
  PaginatedResponse,
  StartVoiceInterviewPayload,
  VoiceInterviewRoom,
  VoiceInterviewTurn,
  VoiceInterviewTurnResult,
} from "../types";

export const voiceInterviewApi = {
  start: async (
    payload: StartVoiceInterviewPayload,
  ): Promise<{ room: VoiceInterviewRoom; turn: VoiceInterviewTurn }> => {
    const { data } = await apiClient.post("/interviews/voice/start", payload);
    return data;
  },

  submitTurn: async (roomId: string, audioBlob: Blob): Promise<VoiceInterviewTurnResult> => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "turn.wav");

    const { data } = await apiClient.post<VoiceInterviewTurnResult>(
      `/interviews/voice/${roomId}/turn`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data;
  },

  complete: async (roomId: string): Promise<VoiceInterviewRoom> => {
    const { data } = await apiClient.post<{ room: VoiceInterviewRoom }>(
      `/interviews/voice/${roomId}/complete`,
    );
    return data.room;
  },

  getRoom: async (roomId: string): Promise<VoiceInterviewRoom> => {
    const { data } = await apiClient.get<{ room: VoiceInterviewRoom }>(
      `/interviews/voice/${roomId}`,
    );
    return data.room;
  },

  getHistory: async (params?: { page?: number }): Promise<PaginatedResponse<VoiceInterviewRoom>> => {
    const { data } = await apiClient.get("/interviews/voice", { params });
    return data;
  },
};
