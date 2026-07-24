import apiClient from "./client";
import { InterviewCategory, InterviewCategoryPayload } from "../types";

export const interviewCategoriesApi = {
  // Catégories actives — utilisé par le sélecteur "Démarrer un entretien"
  list: async (): Promise<InterviewCategory[]> => {
    const { data } = await apiClient.get<{ data: InterviewCategory[] }>("/interviews/categories");
    return data.data;
  },

  // Toutes les catégories (actives + inactives) — admin uniquement
  adminList: async (): Promise<InterviewCategory[]> => {
    const { data } = await apiClient.get<{ data: InterviewCategory[] }>("/admin/interview-categories");
    return data.data;
  },

  create: async (payload: InterviewCategoryPayload): Promise<InterviewCategory> => {
    const { data } = await apiClient.post<{ category: InterviewCategory }>(
      "/admin/interview-categories",
      payload,
    );
    return data.category;
  },

  update: async (id: string, payload: InterviewCategoryPayload): Promise<InterviewCategory> => {
    const { data } = await apiClient.put<{ category: InterviewCategory }>(
      `/admin/interview-categories/${id}`,
      payload,
    );
    return data.category;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/interview-categories/${id}`);
  },
};
