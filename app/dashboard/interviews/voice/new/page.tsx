"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Briefcase, Info, Loader2, Mic, Sparkles } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVoiceInterview } from "@/lib/hooks/useVoiceInterview";
import { useJob } from "@/lib/hooks/useMarketplace";
import { marketplaceApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/useTranslation";

type EntryMode = "practice" | "job_interview";

function NewVoiceInterviewPageContent() {
  const router = useRouter();
  const { t } = useT();
  const searchParams = useSearchParams();
  const preselectedJobId = searchParams.get("job_posting_id") ?? "";
  const { startRoom, isStarting } = useVoiceInterview();

  const [entryMode, setEntryMode] = useState<EntryMode>(preselectedJobId ? "job_interview" : "practice");
  const [jobPostingId, setJobPostingId] = useState<string>(preselectedJobId);
  // La voix IA (Groq) ne supporte pour l'instant que l'anglais et l'arabe —
  // pas de français disponible. On force l'anglais tant que ça n'a pas changé.
  const language = "en" as const;

  const { data: preselectedJob } = useJob(preselectedJobId || undefined);

  const { data: jobs, isLoading: isLoadingJobs } = useQuery({
    queryKey: ["jobs", "voice-interview-picker"],
    queryFn: () => marketplaceApi.getJobs({ per_page: 50 }),
    enabled: entryMode === "job_interview" && jobPostingId !== preselectedJobId,
  });

  const canStart = entryMode === "practice" || (entryMode === "job_interview" && !!jobPostingId);

  const handleStart = () => {
    startRoom({
      job_posting_id: entryMode === "job_interview" ? jobPostingId : undefined,
      language,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader showSearch={false} />

      <div className="max-w-2xl mx-auto px-6 py-10">
        <button
          onClick={() => router.push("/dashboard/interviews")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          {t("voiceInterview.backToInterviews")}
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center">
            <Mic className="w-5 h-5 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t("voiceInterview.title")}</h1>
        </div>
        <p className="text-muted-foreground mb-8">{t("voiceInterview.subtitle")}</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setEntryMode("practice")}
            className={cn(
              "flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all cursor-pointer",
              entryMode === "practice"
                ? "border-accent bg-accent/10"
                : "border-border/50 bg-card hover:border-accent/40",
            )}>
            <Sparkles className={cn("w-5 h-5", entryMode === "practice" ? "text-accent" : "text-muted-foreground")} />
            <span className="font-medium text-foreground">{t("voiceInterview.freeTraining")}</span>
            <span className="text-xs text-muted-foreground">{t("voiceInterview.practiceModeDesc")}</span>
          </button>

          <button
            onClick={() => setEntryMode("job_interview")}
            className={cn(
              "flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all cursor-pointer",
              entryMode === "job_interview"
                ? "border-accent bg-accent/10"
                : "border-border/50 bg-card hover:border-accent/40",
            )}>
            <Briefcase className={cn("w-5 h-5", entryMode === "job_interview" ? "text-accent" : "text-muted-foreground")} />
            <span className="font-medium text-foreground">{t("voiceInterview.jobMode")}</span>
            <span className="text-xs text-muted-foreground">{t("voiceInterview.jobModeDesc")}</span>
          </button>
        </div>

        {entryMode === "job_interview" && (
          <div className="mb-6">
            <label className="text-xs font-medium tracking-wider text-muted-foreground uppercase mb-2 block">
              {t("voiceInterview.chooseJob")}
            </label>
            {jobPostingId && jobPostingId === preselectedJobId && preselectedJob ? (
              <div className="flex items-center justify-between p-3 rounded-lg border border-accent/40 bg-accent/5">
                <div>
                  <p className="text-sm font-medium text-foreground">{preselectedJob.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {preselectedJob.recruiter?.company_name ?? t("jobs.confidentialCompany")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setJobPostingId("")}
                  className="text-xs text-accent hover:underline cursor-pointer shrink-0">
                  {t("voiceInterview.change")}
                </button>
              </div>
            ) : isLoadingJobs ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-3">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("voiceInterview.loadingJobs")}
              </div>
            ) : (
              <Select value={jobPostingId} onValueChange={setJobPostingId}>
                <SelectTrigger className="w-full h-12 bg-card border-border/50">
                  <SelectValue placeholder={t("voiceInterview.selectJobPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {jobs?.data.length ? (
                    jobs.data.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title}
                        {job.recruiter?.company_name ? ` — ${job.recruiter.company_name}` : ""}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-3 py-6 text-sm text-muted-foreground text-center">
                      {t("voiceInterview.noJobsAvailable")}
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        <div className="mb-8 flex items-start gap-2.5 p-3 rounded-lg bg-accent/5 border border-accent/20">
          <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">{t("voiceInterview.languageNotice")}</p>
        </div>

        <Button
          onClick={handleStart}
          disabled={!canStart || isStarting}
          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-medium cursor-pointer">
          {isStarting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("voiceInterview.starting")}
            </>
          ) : (
            <>
              <Mic className="mr-2 h-4 w-4" />
              {t("voiceInterview.start")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default function NewVoiceInterviewPage() {
  return (
    <Suspense fallback={null}>
      <NewVoiceInterviewPageContent />
    </Suspense>
  );
}
