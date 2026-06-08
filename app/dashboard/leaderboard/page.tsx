"use client";

import { DashboardHeader } from "@/components/dashboard";
import { useLeaderboard } from "@/lib/hooks/useStats";
import { useAuthStore } from "@/lib/stores/authStore";
import { Trophy, Medal, Star } from "lucide-react";
import { PageLoader } from "@/components/ui/page-loader";
import { useState } from "react";
import { useT } from "@/lib/i18n/useTranslation";

export default function LeaderboardPage() {
  const [period, setPeriod] = useState("weekly");
  const { data, isLoading } = useLeaderboard({ period });
  const currentUser = useAuthStore((s) => s.user);
  const { t } = useT();

  const PERIODS = [
    { label: t("leaderboard.weekly"), value: "weekly" },
    { label: t("leaderboard.monthly"), value: "monthly" },
    { label: t("leaderboard.allTime"), value: "all_time" },
  ];

  const entries = data?.leaderboard ?? data?.data ?? [];

  return (
    <>
      <DashboardHeader />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Trophy className="w-6 h-6 text-warning" />
                {t("leaderboard.title")}
              </h1>
              <p className="text-muted-foreground">{t("leaderboard.subtitle")}</p>
            </div>
            <div className="flex gap-2">
              {PERIODS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPeriod(p.value)}
                  className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                    period === p.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-muted-foreground hover:bg-secondary"
                  }`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <PageLoader />
          ) : (
            <div className="space-y-2">
              {entries.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>{t("leaderboard.empty")}</p>
                </div>
              ) : (
                entries.map((entry: any, index: number) => {
                  const rank = entry.rank ?? index + 1;
                  const isMe = entry.user?.id === currentUser?.id || entry.id === currentUser?.id;
                  const name = entry.user?.name ?? entry.name ?? "—";
                  const username = entry.user?.username ?? entry.username ?? "";
                  const score = entry.global_score ?? entry.score ?? 0;
                  const xp = entry.xp_total ?? 0;
                  const level = entry.level ?? 1;

                  return (
                    <div
                      key={entry.user?.id ?? entry.id ?? index}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                        isMe
                          ? "bg-primary/10 border-primary/30"
                          : "bg-card border-border hover:border-primary/20"
                      }`}>
                      <div className="w-10 text-center shrink-0">
                        {rank === 1 ? (
                          <Trophy className="w-6 h-6 text-warning mx-auto" />
                        ) : rank === 2 ? (
                          <Medal className="w-6 h-6 text-muted-foreground mx-auto" />
                        ) : rank === 3 ? (
                          <Star className="w-6 h-6 text-orange-400 mx-auto" />
                        ) : (
                          <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
                        )}
                      </div>

                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-foreground font-semibold shrink-0">
                        {name.charAt(0)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground truncate">{name}</span>
                          {isMe && (
                            <span className="text-xs px-1.5 py-0.5 bg-primary/20 text-primary rounded">
                              {t("leaderboard.you")}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          @{username} · Lv.{level} · {xp.toLocaleString()} XP
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xl font-bold text-foreground">{score}</div>
                        <div className="text-xs text-muted-foreground">{t("leaderboard.score")}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
