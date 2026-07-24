"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Wallet,
  Briefcase,
  Mic,
  CheckCircle2,
  Calendar,
  Eye,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { PageLoader } from "@/components/ui/page-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useJob } from "@/lib/hooks/useMarketplace";
import { useT } from "@/lib/i18n/useTranslation";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

const CONTRACT_LABEL_KEYS: Record<string, string> = {
  full_time: "recruiter.fullTime",
  part_time: "recruiter.partTime",
  freelance: "recruiter.freelance",
};

const WORK_MODE_LABEL_KEYS: Record<string, string> = {
  remote: "recruiter.remote",
  hybrid: "recruiter.hybrid",
  onsite: "recruiter.onsite",
};

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { t, locale } = useT();
  const { data: job, isLoading, error } = useJob(id);

  if (isLoading) return <PageLoader fullScreen />;

  if (error || !job) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <DashboardHeader showSearch={false} />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <p className="text-muted-foreground">{t("jobs.notFound")}</p>
          <Button onClick={() => router.push("/dashboard/jobs")}>{t("jobs.backToJobs")}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardHeader showSearch={false} />

      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
          <button
            onClick={() => router.push("/dashboard/jobs")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            {t("jobs.backToJobs")}
          </button>

          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                <Building2 className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{job.title}</h1>
                <p className="text-muted-foreground">
                  {job.recruiter?.company_name ?? t("jobs.confidentialCompany")}
                  {job.recruiter?.industry ? ` — ${job.recruiter.industry}` : ""}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">{t(CONTRACT_LABEL_KEYS[job.contract_type] ?? "recruiter.fullTime")}</Badge>
              <Badge variant="secondary">{t(WORK_MODE_LABEL_KEYS[job.work_mode] ?? "recruiter.remote")}</Badge>
              {job.min_level && <Badge variant="outline">{t("jobs.level")} {job.min_level}</Badge>}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {job.location ?? t("jobs.locationNotSpecified")}
              </span>
              {(job.salary_min || job.salary_max) && (
                <span className="flex items-center gap-1.5">
                  <Wallet className="w-4 h-4" />
                  {job.salary_min && job.salary_max
                    ? `${job.salary_min.toLocaleString()}–${job.salary_max.toLocaleString()} ${job.currency}`
                    : `${(job.salary_min ?? job.salary_max)?.toLocaleString()} ${job.currency}`}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {t("jobs.publishedOn")} {new Date(job.published_at).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                {job.views_count} {t("jobs.views")}
              </span>
            </div>

            <Link href={`/dashboard/interviews/voice/new?job_posting_id=${job.id}`}>
              <Button className="w-full h-12 bg-primary hover:bg-primary/90 font-medium cursor-pointer">
                <Mic className="w-4 h-4 mr-2" />
                {t("jobs.trainWithVoiceInterview")}
              </Button>
            </Link>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              {t("jobs.description")}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {!!job.required_skills?.length && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold text-foreground mb-3">{t("jobs.requiredSkills")}</h2>
              <div className="flex flex-wrap gap-2">
                {job.required_skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {!!job.required_certs?.length && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold text-foreground mb-3">{t("jobs.recommendedCerts")}</h2>
              <div className="space-y-2">
                {job.required_certs.map((cert) => (
                  <div key={cert} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                    {cert}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
