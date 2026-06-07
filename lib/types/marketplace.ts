export interface DeveloperProfile {
  headline: string | null;
  current_level: string;
  overall_score: number;
  interview_score: number;
  cert_score: number;
  certifications_count: number;
  work_mode: string;
  location_country: string | null;
  location_city: string | null;
  target_salary_min: number | null;
  target_salary_max: number | null;
}

export interface Developer {
  id: string;
  name: string;
  username: string;
  avatar_url: string | null;
  level: number;
  xp_total: number;
  current_streak: number;
  is_available: boolean;
  profile: DeveloperProfile | null;
  skills: Array<{
    name: string;
    level: string;
    is_certified: boolean;
  }>;
  badges: Array<{
    title: string;
    badge_type: string;
    issued_at: string;
    verify_token: string;
  }>;
}

export interface JobPosting {
  id: string;
  title: string;
  description: string;
  contract_type: string;
  work_mode: string;
  min_level: string | null;
  location: string | null;
  salary_min: number | null;
  salary_max: number | null;
  currency: string;
  status: string;
  views_count: number;
  published_at: string;
  recruiter: {
    id: string;
    name: string;
    company_name: string;
    company_logo: string | null;
  } | null;
}

export interface SearchFilters {
  search?: string;
  level?: string;
  work_mode?: string;
  location_country?: string;
  skills?: string;
  is_available?: boolean;
  sort?: string;
  per_page?: number;
  page?: number;
}
