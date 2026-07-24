"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Bot,
  CheckCircle,
  Clock,
  Target,
  Trophy,
  TrendingDown,
  TrendingUp,
  User,
  XCircle,
} from "lucide-react";
import { voiceInterviewApi } from "@/lib/api";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { PageLoader } from "@/components/ui/page-loader";
import { useT } from "@/lib/i18n/useTranslation";

interface VoiceReportPageProps {
  params: Promise<{ id: string }>;
}

const READINESS_LABEL_KEYS: Record<string, { key: string; color: string }> = {
  ready: { key: "voiceInterview.readinessReady", color: "text-success" },
  senior_ready: { key: "voiceInterview.readinessSeniorReady", color: "text-success" },
  almost_ready: { key: "voiceInterview.readinessAlmostReady", color: "text-warning" },
  not_ready: { key: "voiceInterview.readinessNotReady", color: "text-destructive" },
};

export default function VoiceInterviewReportPage({ params }: VoiceReportPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useT();

  const { data: room, isLoading, error } = useQuery({
    queryKey: ["voice-interview", id],
    queryFn: () => voiceInterviewApi.getRoom(id),
    enabled: !!id,
  });

  if (isLoading) return <PageLoader fullScreen />;

  if (error || !room || room.status !== "completed") {
    return (
      <div className="h-screen flex flex-col bg-background">
        <DashboardHeader showSearch={false} />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <XCircle className="w-12 h-12 text-destructive" />
          <p className="text-muted-foreground">{t("voiceInterview.reportNotFound")}</p>
          <button
            onClick={() => router.push("/dashboard/interviews")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm cursor-pointer">
            {t("voiceInterview.backToInterviews")}
          </button>
        </div>
      </div>
    );
  }

  const report = room.score_breakdown?.report;
  const score = room.score_total ?? report?.score ?? 0;
  const isPassed = score >= 70;
  const durationMin = room.score_breakdown?.duration_sec
    ? Math.round(room.score_breakdown.duration_sec / 60)
    : null;
  const readiness = READINESS_LABEL_KEYS[report?.readiness_level ?? "not_ready"] ?? READINESS_LABEL_KEYS.not_ready;
  const turns = room.turns ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardHeader showSearch={false} />

      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          <button
            onClick={() => router.push("/dashboard/interviews")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            {t("voiceInterview.backToInterviews")}
          </button>

          {/* Hero */}
          <div
            className={`rounded-2xl border p-8 flex flex-col sm:flex-row items-center gap-8 ${
              isPassed ? "bg-success/5 border-success/30" : "bg-warning/5 border-warning/30"
            }`}>
            <div className="relative shrink-0">
              <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
                <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="6" className="text-border" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={isPassed ? "oklch(0.7 0.18 145)" : "oklch(0.75 0.18 75)"}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - score / 100)}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold font-mono ${isPassed ? "text-success" : "text-warning"}`}>
                  {score}
                </span>
                <span className="text-xs text-muted-foreground">/100</span>
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                {isPassed ? (
                  <CheckCircle className="w-5 h-5 text-success" />
                ) : (
                  <Target className="w-5 h-5 text-warning" />
                )}
                <span className={`font-semibold text-lg ${isPassed ? "text-success" : "text-warning"}`}>
                  {isPassed ? t("interviews.statusPass") : t("interviews.statusReview")}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {t("voiceInterview.voiceInterviewPrefix")} {room.job_posting ? room.job_posting.title : t("voiceInterview.freeTraining")}
              </h1>
              <p className={`text-sm font-medium ${readiness.color}`}>{t(readiness.key)}</p>
              {report?.estimated_weeks_to_improve && (
                <p className="text-xs text-muted-foreground mt-1">
                  {t("voiceInterview.weeksEstimatePrefix")} {report.estimated_weeks_to_improve} {t("voiceInterview.weeksEstimateSuffix")}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-col sm:gap-3 text-center sm:text-right shrink-0">
              {durationMin != null && (
                <div>
                  <div className="flex items-center justify-center sm:justify-end gap-1.5 text-muted-foreground text-xs mb-0.5">
                    <Clock className="w-3 h-3" /> {t("voiceInterview.duration")}
                  </div>
                  <p className="font-mono font-semibold text-foreground">{durationMin} min</p>
                </div>
              )}
              <div>
                <div className="flex items-center justify-center sm:justify-end gap-1.5 text-muted-foreground text-xs mb-0.5">
                  <Trophy className="w-3 h-3" /> {t("voiceInterview.xpEarned")}
                </div>
                <p className="font-mono font-semibold text-primary">+{room.xp_earned}</p>
              </div>
            </div>
          </div>

          {/* Feedback IA */}
          {room.ai_feedback && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Bot className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-foreground">{t("voiceInterview.aiFeedback")}</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{room.ai_feedback}</p>
            </div>
          )}

          {/* Forces / axes d'amélioration */}
          <div className="grid sm:grid-cols-2 gap-4">
            {!!report?.strengths?.length && (
              <div className="bg-success/5 border border-success/20 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <h2 className="font-semibold text-success">{t("session.strengths")}</h2>
                </div>
                <ul className="space-y-2">
                  {report.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!!report?.improvement_areas?.length && (
              <div className="bg-warning/5 border border-warning/20 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown className="w-4 h-4 text-warning" />
                  <h2 className="font-semibold text-warning">{t("session.weaknesses")}</h2>
                </div>
                <ul className="space-y-2">
                  {report.improvement_areas.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <Target className="w-3.5 h-3.5 text-warning mt-0.5 shrink-0" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Transcription complète */}
          {turns.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold text-foreground mb-4">{t("voiceInterview.transcriptTitle")}</h2>
              <div className="space-y-4">
                {turns.map((turn) => (
                  <div key={turn.id} className="flex gap-3">
                    <div
                      className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center ${
                        turn.speaker === "ai" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"
                      }`}>
                      {turn.speaker === "ai" ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed pt-0.5">
                      {turn.transcript}
                    </p>
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
