"use client";

import { DashboardHeader } from "@/components/dashboard";
import { ContributionHeatmap } from "@/components/skillforge";
import { useMyStats, useActivityHeatmap, useXpHistory } from "@/lib/hooks/useStats";
import { Loader2, Zap, Flame, Award, BarChart2 } from "lucide-react";

export default function ProgressPage() {
  const { data: stats, isLoading: statsLoading } = useMyStats();
  const { data: activity, isLoading: activityLoading } = useActivityHeatmap();
  const { data: xpHistory, isLoading: xpLoading } = useXpHistory();

  const activityData =
    activity?.map((a) => ({ date: a.date, count: a.count })) ??
    generateEmptyActivity();

  return (
    <>
      <DashboardHeader />
      <main className="flex-1 overflow-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ma Progression</h1>
          <p className="text-muted-foreground">Suivez votre évolution sur SkillForge</p>
        </div>

        {/* Stats Cards */}
        {statsLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatItem
              icon={<Zap className="w-5 h-5 text-accent" />}
              value={stats?.xp_total?.toLocaleString() ?? "0"}
              label="XP Total"
              color="accent"
            />
            <StatItem
              icon={<Flame className="w-5 h-5 text-warning" />}
              value={stats?.current_streak?.toString() ?? "0"}
              label="Streak actuel"
              color="warning"
            />
            <StatItem
              icon={<Award className="w-5 h-5 text-primary" />}
              value={stats?.badges_count?.toString() ?? "0"}
              label="Badges"
              color="primary"
            />
            <StatItem
              icon={<BarChart2 className="w-5 h-5 text-green-500" />}
              value={`#${stats?.rank ?? "—"}`}
              label="Classement"
              color="green"
            />
          </div>
        )}

        {/* Heatmap */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Activité (6 derniers mois)
          </h2>
          {activityLoading ? (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <ContributionHeatmap data={activityData} />
          )}
        </div>

        {/* XP History */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Historique XP récent
          </h2>
          {xpLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : xpHistory && xpHistory.length > 0 ? (
            <div className="space-y-2">
              {xpHistory.slice(0, 20).map((entry, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{entry.description}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {entry.source} · {new Date(entry.date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <span className="text-accent font-semibold text-sm">+{entry.xp} XP</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">Aucun historique XP disponible.</p>
              <p className="text-xs mt-1">
                Complétez des interviews ou des certifications pour gagner des XP !
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function StatItem({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div
        className={`w-10 h-10 rounded-lg mb-3 flex items-center justify-center bg-${color}/10`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function generateEmptyActivity() {
  const data = [];
  const today = new Date();
  for (let i = 181; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    data.push({ date: d.toISOString().split("T")[0], count: 0 });
  }
  return data;
}
