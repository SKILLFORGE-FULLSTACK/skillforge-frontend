"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { interviewApi } from "@/lib/api";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { PageLoader } from "@/components/ui/page-loader";
import {
  Trophy,
  Target,
  Clock,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  BookOpen,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react";

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

export default function InterviewReportPage({ params }: ReportPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const { data: report, isLoading, error } = useQuery({
    queryKey: ["interview-report", id],
    queryFn: () => interviewApi.getReport(id),
    enabled: !!id,
  });

  if (isLoading) return <PageLoader fullScreen />;

  if (error || !report) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <DashboardHeader showSearch={false} />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <XCircle className="w-12 h-12 text-destructive" />
          <p className="text-muted-foreground">Rapport introuvable.</p>
          <button
            onClick={() => router.push("/dashboard/interviews")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm cursor-pointer">
            Retour aux interviews
          </button>
        </div>
      </div>
    );
  }

  const session = report.session;
  const score = session.score_total ?? 0;
  const isPassed = score >= 70;
  const durationMin = session.duration_sec ? Math.round(session.duration_sec / 60) : "—";

  const readinessLabels: Record<string, { label: string; color: string }> = {
    ready:        { label: "Prêt pour un entretien réel", color: "text-success" },
    almost_ready: { label: "Presque prêt", color: "text-warning" },
    improving:    { label: "En progression", color: "text-primary" },
    not_ready:    { label: "À améliorer davantage", color: "text-destructive" },
  };
  const readiness = readinessLabels[report.readiness_level] ?? readinessLabels.not_ready;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardHeader showSearch={false} />

      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

          {/* Back */}
          <button
            onClick={() => router.push("/dashboard/interviews")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            Retour aux interviews
          </button>

          {/* Hero Score Card */}
          <div className={`rounded-2xl border p-8 flex flex-col sm:flex-row items-center gap-8 ${
            isPassed
              ? "bg-success/5 border-success/30"
              : "bg-warning/5 border-warning/30"
          }`}>
            {/* Score circle */}
            <div className="relative shrink-0">
              <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
                <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="6" className="text-border" />
                <circle
                  cx="60" cy="60" r="50"
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
                  {isPassed ? "PASSED" : "NEEDS REVIEW"}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-foreground capitalize mb-2">
                {session.type.replace("_", " ")}
                {session.stack_focus ? ` — ${session.stack_focus}` : ""}
              </h1>
              <p className={`text-sm font-medium ${readiness.color}`}>{readiness.label}</p>
              {report.weeks_to_improve && (
                <p className="text-xs text-muted-foreground mt-1">
                  Estimation : {report.weeks_to_improve} semaine(s) pour progresser
                </p>
              )}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 sm:flex sm:flex-col sm:gap-3 text-center sm:text-right shrink-0">
              <div>
                <div className="flex items-center justify-center sm:justify-end gap-1.5 text-muted-foreground text-xs mb-0.5">
                  <Clock className="w-3 h-3" /> Durée
                </div>
                <p className="font-mono font-semibold text-foreground">{durationMin} min</p>
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-end gap-1.5 text-muted-foreground text-xs mb-0.5">
                  <Trophy className="w-3 h-3" /> XP gagnés
                </div>
                <p className="font-mono font-semibold text-primary">+{session.xp_earned}</p>
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-end gap-1.5 text-muted-foreground text-xs mb-0.5">
                  <Lightbulb className="w-3 h-3" /> Indices
                </div>
                <p className="font-mono font-semibold text-foreground">{session.hints_used}</p>
              </div>
            </div>
          </div>

          {/* AI Feedback */}
          {report.ai_feedback && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-foreground">Feedback IA</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{report.ai_feedback}</p>
            </div>
          )}

          {/* Strengths & Improvements */}
          <div className="grid sm:grid-cols-2 gap-4">
            {report.strengths?.length > 0 && (
              <div className="bg-success/5 border border-success/20 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <h2 className="font-semibold text-success">Points forts</h2>
                </div>
                <ul className="space-y-2">
                  {report.strengths.map((s: any, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />
                      {typeof s === "string" ? s : s.title ?? s.description ?? JSON.stringify(s)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {report.improvement_areas?.length > 0 && (
              <div className="bg-warning/5 border border-warning/20 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown className="w-4 h-4 text-warning" />
                  <h2 className="font-semibold text-warning">À améliorer</h2>
                </div>
                <ul className="space-y-2">
                  {report.improvement_areas.map((a: any, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <Target className="w-3.5 h-3.5 text-warning mt-0.5 shrink-0" />
                      {typeof a === "string" ? a : a.title ?? a.description ?? JSON.stringify(a)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Resources */}
          {report.resources?.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-foreground">Ressources recommandées</h2>
              </div>
              <ul className="space-y-2">
                {report.resources.map((r: any, i: number) => {
                  const title = typeof r === "string" ? r : r.title ?? r.topic ?? JSON.stringify(r);
                  const type  = typeof r === "object" ? r.type : null;
                  return (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 font-mono">
                        {i + 1}
                      </span>
                      <span className="flex-1">{title}</span>
                      {type && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground font-mono">
                          {type}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Per-question breakdown */}
          {Array.isArray(report.responses) && report.responses.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold text-foreground mb-4">Détail par question</h2>
              <div className="space-y-3">
                {report.responses.map((r: any, i: number) => (
                  <div key={r.id ?? i} className="flex items-center gap-4 p-3 bg-secondary/40 rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-mono shrink-0 ${
                      r.score >= 70 ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
                    }`}>
                      {r.score}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        Q{i + 1} — {r.verdict ?? "—"}
                      </p>
                      {r.time_taken_sec && (
                        <p className="text-xs text-muted-foreground">
                          {Math.round(r.time_taken_sec / 60)} min
                        </p>
                      )}
                    </div>
                    <div className={`text-xs font-medium px-2 py-0.5 rounded ${
                      r.score >= 70 ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                    }`}>
                      {r.score}/100
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="flex gap-3 justify-center pb-4">
            <button
              onClick={() => router.push("/dashboard/interviews")}
              className="px-6 py-2.5 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors cursor-pointer">
              Retour à la liste
            </button>
            <button
              onClick={() => router.push("/dashboard/interviews")}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer">
              Nouvel entretien
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
