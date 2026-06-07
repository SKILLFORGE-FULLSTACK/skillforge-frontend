import apiClient from "./client";
import {
  Developer,
  JobPosting,
  PaginatedResponse,
  SearchFilters,
} from "../types";

export const marketplaceApi = {
  searchDevelopers: async (
    filters: SearchFilters,
  ): Promise<PaginatedResponse<Developer>> => {
    const { data } = await apiClient.get("/marketplace/developers", {
      params: filters,
    });
    return data;
  },

  getDeveloper: async (
    identifier: string,
  ): Promise<{
    developer: Developer;
    is_saved: boolean;
  }> => {
    const { data } = await apiClient.get(
      `/marketplace/developers/${identifier}`,
    );
    return data;
  },

  contactDeveloper: async (payload: {
    developer_id: string;
    message: string;
    job_posting_id?: string;
  }) => {
    const { data } = await apiClient.post("/marketplace/contact", payload);
    return data;
  },

  getSaved: async () => {
    const { data } = await apiClient.get("/marketplace/saved");
    return data;
  },

  saveProfile: async (developerId: string, note?: string) => {
    const { data } = await apiClient.post(`/marketplace/saved/${developerId}`, {
      note,
    });
    return data;
  },

  unsaveProfile: async (developerId: string) => {
    const { data } = await apiClient.delete(
      `/marketplace/saved/${developerId}`,
    );
    return data;
  },

  getJobs: async (filters?: {
    search?: string;
    contract_type?: string;
    work_mode?: string;
    per_page?: number;
  }): Promise<PaginatedResponse<JobPosting>> => {
    const { data } = await apiClient.get("/jobs", { params: filters });
    return data;
  },

  createJob: async (payload: {
    title: string;
    description: string;
    contract_type: string;
    work_mode: string;
    min_level?: string;
    salary_min?: number;
    salary_max?: number;
    location?: string;
  }): Promise<JobPosting> => {
    const { data } = await apiClient.post("/jobs", payload);
    return data.job;
  },
};
