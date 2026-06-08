"use client";

import { ScoreCircle, ContributionHeatmap, ProgressBar } from "@/components/skillforge";
import { Play, RotateCcw, Zap, ArrowRight, Loader2 } from "lucide-react";
import { SectionLoader } from "@/components/ui/page-loader";
import { useMyStats, useActivityHeatmap } from "@/lib/hooks/useStats";
import { useQuery } from "@tanstack/react-query";
import { interviewApi } from "@/lib/api";
import { useAuthStore } from "@/lib/stores/authStore";
import { useRouter } from "next/navigation";
import { useInterview } from "@/lib/hooks/useInterview";
import { toast } from "sonner";

export function DashboardContent() {
  const { data: stats, isLoading: statsLoading } = useMyStats();
  const { data: activity, isLoading: activityLoading } = useActivityHeatmap();
  const { data: interviewHistory } = useQuery({
    queryKey: ["interviews", { per_page: 5 }],
    queryFn: () => interviewApi.getHistory({ page: 1 }),
  });
  const { startSession, isStarting } = useInterview();
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const activityData = activity?.map((a) => ({ date: a.date, count: a.count })) ?? [];

  const globalScore = stats?.global_score ?? 0;
  const level = stats?.level ?? 1;
  const currentStreak = stats?.current_streak ?? 0;

  return (
    <div className="p-6 space-y-6">
      {/* Top row - Score and Active Path */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Global Skill Score */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-6 text-center">
            GLOBAL SKILL SCORE
          </h3>
          {statsLoading ? (
            <SectionLoader />
          ) : (
            <ScoreCircle
              score={globalScore}
              maxScore={1000}
              size="lg"
              label="/ 1000"
              showChange
              changePercent={stats?.interviews_completed ? 12 : 0}
            />
          )}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">Lv.{level}</div>
              <div className="text-xs text-muted-foreground">Level</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">{currentStreak}</div>
              <div className="text-xs text-muted-foreground">Streak</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">
                {stats?.badges_count ?? 0}
              </div>
              <div className="text-xs text-muted-foreground">Badges</div>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
              MY PROGRESS
            </h3>
            <span className="text-xs text-primary">{stats?.xp_total ?? 0} XP total</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Interview Score</span>
                <span className="text-sm font-semibold text-foreground">
                  {stats?.interview_score ?? 0}/100
                </span>
              </div>
              <ProgressBar value={stats?.interview_score ?? 0} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Certification Score</span>
                <span className="text-sm font-semibold text-foreground">
                  {stats?.cert_score ?? 0}/100
                </span>
              </div>
              <ProgressBar value={stats?.cert_score ?? 0} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {stats?.interviews_completed ?? 0}
              </div>
              <div className="text-xs text-muted-foreground">Interviews Done</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {stats?.certifications_passed ?? 0}
              </div>
              <div className="text-xs text-muted-foreground">Certifications</div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle row - Heatmap and Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Contribution Heatmap */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          {activityLoading ? (
            <SectionLoader size={48} />
          ) : (
            <ContributionHeatmap data={activityData.length > 0 ? activityData : generateEmptyActivity()} />
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
            QUICK ACTIONS
          </h3>
          <div className="space-y-3">
            <button
              onClick={() =>
                startSession({ type: "algo", difficulty: "medium", mode: "practice" })
              }
              disabled={isStarting}
              className="w-full flex items-center gap-3 px-4 py-3 border border-border rounded-lg hover:bg-secondary transition-colors text-left disabled:opacity-50">
              {isStarting ? (
                <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
              ) : (
                <Play className="w-5 h-5 text-muted-foreground" />
              )}
              <span className="font-medium text-foreground">Start Mock Interview</span>
            </button>
            <button
              onClick={() => router.push("/dashboard/certifications")}
              className="w-full flex items-center gap-3 px-4 py-3 border border-border rounded-lg hover:bg-secondary transition-colors text-left">
              <RotateCcw className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-foreground">Resume Certification</span>
            </button>
            <button
              onClick={() => router.push("/dashboard/leaderboard")}
              className="w-full flex items-center gap-3 px-4 py-3 border border-border rounded-lg hover:bg-secondary transition-colors text-left">
              <Zap className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-foreground">View Leaderboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row - Recent Interviews */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Mock Interviews</h3>
          <button
            onClick={() => router.push("/dashboard/interviews")}
            className="text-sm text-primary hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          {interviewHistory?.data.length ? (
            interviewHistory.data.slice(0, 3).map((session) => (
              <InterviewItem
                key={session.id}
                title={`${session.type} — ${session.stack_focus ?? session.difficulty}`}
                date={new Date(session.started_at).toLocaleDateString("fr-FR")}
                focus={`${session.questions_count} questions`}
                score={session.score_total ?? 0}
                status={session.status === "completed" ? (session.score_total && session.score_total >= 70 ? "PASS" : "NEEDS REVIEW") : "IN PROGRESS"}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">Pas encore d'interviews. Démarrez votre premier mock interview !</p>
              <button
                onClick={() =>
                  startSession({ type: "algo", difficulty: "medium", mode: "practice" })
                }
                disabled={isStarting}
                className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                Commencer maintenant
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function generateEmptyActivity() {
  const data = [];
  const today = new Date();
  for (let i = 181; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toISOString().split("T")[0],
      count: 0,
    });
  }
  return data;
}

function InterviewItem({
  title,
  date,
  focus,
  score,
  status,
}: {
  title: string;
  date: string;
  focus: string;
  score: number;
  status: string;
}) {
  const isPass = status === "PASS";

  return (
    <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
        <span className="text-primary font-mono text-sm">{"{}"}</span>
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-foreground capitalize">{title}</h4>
        <p className="text-sm text-muted-foreground">
          {date} • {focus}
        </p>
      </div>
      <div className="text-right">
        <div
          className={`text-lg font-semibold ${isPass ? "text-success" : "text-warning"}`}>
          {score}%
        </div>
        <div className={`text-xs uppercase ${isPass ? "text-success" : "text-warning"}`}>
          {status}
        </div>
      </div>
    </div>
  );
}
