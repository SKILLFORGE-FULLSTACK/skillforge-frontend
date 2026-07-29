import apiClient from "./client";

export interface Certification {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: string;
  category: string;
  estimated_hours: number;
  pass_score: number;
  skills: string[];
  is_active: boolean;
}

export interface CertificationDetail extends Certification {
  project_brief: string;
  requirements: Array<{ title: string; description: string }>;
  evaluation_criteria: Array<{ name: string; weight: number }>;
}

export interface UserBadge {
  id: string;
  title: string;
  badge_type: string;
  score: number | null;
  verify_token: string;
  verify_url: string;
  badge_image_url: string | null;
  certificate_url: string | null;
  issued_at: string | null;
  expires_at: string | null;
  is_expired: boolean;
}

export interface Submission {
  id: string;
  certification: { slug: string; title: string; level: string };
  status: "pending" | "in_review" | "passed" | "failed";
  score: number | null;
  submitted_at: string;
  reviewed_at: string | null;
  days_remaining: number | null;
  expires_at: string | null;
  badge?: UserBadge | null;
}

export interface VerifyBadgeResponse {
  valid: boolean;
  badge: {
    title: string;
    description: string | null;
    score: number | null;
    issued_at: string | null;
    expires_at: string | null;
    is_expired: boolean;
    is_valid: boolean;
    certificate_url: string | null;
    developer: { name: string; username: string };
    certification?: { title: string; category: string; level: string };
  };
}

export const certificationsApi = {
  list: async (): Promise<Certification[]> => {
    const { data } = await apiClient.get("/certifications");
    const raw = data.certifications ?? data.data ?? data;
    return Array.isArray(raw) ? (raw as Certification[]) : [];
  },

  show: async (slug: string): Promise<CertificationDetail> => {
    const { data } = await apiClient.get(`/certifications/${slug}`);
    return (data.certification ?? data) as CertificationDetail;
  },

  start: async (slug: string): Promise<Submission> => {
    const { data } = await apiClient.post<{ submission: Submission }>(
      `/certifications/${slug}/start`
    );
    return data.submission;
  },

  mySubmissions: async (): Promise<Submission[]> => {
    const { data } = await apiClient.get("/certifications/my-submissions");
    const raw = data.submissions ?? data.data ?? data;
    return Array.isArray(raw) ? (raw as Submission[]) : [];
  },

  submitWork: async (
    submissionId: string,
    payload: { github_url: string; live_url?: string; notes?: string }
  ) => {
    const { data } = await apiClient.post(`/submissions/${submissionId}/submit`, {
      github_repo_url: payload.github_url,
      live_url: payload.live_url,
      notes: payload.notes,
    });
    return data;
  },

  getReport: async (submissionId: string) => {
    const { data } = await apiClient.get(`/submissions/${submissionId}/report`);
    return data.report;
  },

  verifyBadge: async (token: string): Promise<VerifyBadgeResponse> => {
    const { data } = await apiClient.get(`/badges/verify/${token}`);
    return data;
  },
};
