import apiClient from "./client";

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
}

export const notificationsApi = {
  list: async (): Promise<{ notifications: Notification[]; unread_count: number }> => {
    const { data } = await apiClient.get<{
      notifications: Notification[];
      unread_count: number;
    }>("/notifications");
    return data;
  },

  markRead: async (id: string): Promise<void> => {
    await apiClient.post(`/notifications/${id}/read`);
  },

  markAllRead: async (): Promise<void> => {
    await apiClient.post("/notifications/read-all");
  },
};
