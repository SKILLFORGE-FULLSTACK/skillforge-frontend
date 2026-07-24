"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Play, Clock, BarChart2, Loader2, AlertCircle, RotateCcw, FileText, Mic } from "lucide-react";
import { PageLoader } from "@/components/ui/page-loader";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useInterview } from "@/lib/hooks/useInterview";
import { useInterviewCategories } from "@/lib/hooks/useInterviewCategories";
import { useQuery } from "@tanstack/react-query";
import { interviewApi } from "@/lib/api";
import { InterviewCategory, InterviewType, StartInterviewPayload } from "@/lib/types";
import { useT } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils/cn";

export function InterviewsListContent() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const { startSession, isStarting, resumeSession, isResuming } = useInterview();
  const { data: categories } = useInterviewCategories();
  const { t } = useT();
  const router = useRouter();

  const { data: history, isLoading, error } = useQuery({
    queryKey: ["interviews"],
    queryFn: () => interviewApi.getHistory({ page: 1 }),
  });

  const filtered = history?.data.filter((s) => {
    const matchSearch =
      !search ||
      s.type.toLowerCase().includes(search.toLowerCase()) ||
      (s.stack_focus ?? "").toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "all" || s.type === activeCategory;
    return matchSearch && matchCat;
  }) ?? [];

  const handleStart = (cat: InterviewCategory) => {
    const payload: StartInterviewPayload = {
      type: cat.key as InterviewType,
      difficulty: cat.default_difficulty,
      mode: "practice",
      ...(cat.stack_focus ? { stack_focus: cat.stack_focus } : {}),
    };
    startSession(payload);
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("interviews.title")}
          </h1>
          <p className="text-muted-foreground">{t("interviews.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-accent/50 text-accent hover:bg-accent/10 hover:text-accent cursor-pointer"
            onClick={() => router.push("/dashboard/interviews/voice/new")}>
            <Mic className="w-4 h-4 mr-2" />
            {t("interviews.voiceInterview")}
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90 cursor-pointer"
            disabled={isStarting}
            onClick={() =>
              startSession({
                type: "algo",
                difficulty: "medium",
                mode: "practice",
              })
            }>
            {isStarting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            {t("interviews.newMock")}
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("interviews.searchPlaceholder")}
            className="pl-10 bg-muted border-border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2 cursor-pointer hover:bg-accent/10 hover:text-accent">
          <Filter className="w-4 h-4 mr-2" />
          {t("interviews.filters")}
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 mb-6">
        <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          {t("interviews.startNew")}
        </h2>
        <div className="flex flex-wrap gap-2">
          {categories?.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleStart(cat)}
              disabled={isStarting}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-secondary hover:border-primary/50 transition-colors disabled:opacity-50 cursor-pointer">
              <Play className="w-3.5 h-3.5 text-primary" />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={activeCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory("all")}
          className={cn(
            "cursor-pointer",
            activeCategory === "all" ? "bg-primary" : "hover:bg-primary/10 hover:text-primary",
          )}>
          {t("interviews.categories.all")}
        </Button>
        {categories?.map((cat) => (
          <Button
            key={cat.key}
            variant={activeCategory === cat.key ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat.key)}
            className={cn(
              "cursor-pointer",
              activeCategory === cat.key
                ? "bg-primary"
                : "hover:bg-primary/10 hover:text-primary",
            )}>
            {cat.label}
          </Button>
        ))}
      </div>

      {isLoading && <PageLoader />}

      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          <AlertCircle className="w-5 h-5" />
          <span>{t("interviews.errorLoad")}</span>
        </div>
      )}

      {!isLoading && !error && (
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <BarChart2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">{t("interviews.empty")}</p>
              <p className="text-sm mt-1">{t("interviews.emptyHint")}</p>
            </div>
          ) : (
            filtered.map((session) => {
              const isPassed =
                session.status === "completed" &&
                (session.score_total ?? 0) >= 70;
              const statusLabel =
                session.status === "completed"
                  ? isPassed
                    ? t("interviews.statusPass")
                    : t("interviews.statusReview")
                  : t("interviews.statusInProgress");

              return (
                <Card
                  key={session.id}
                  className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                          <BarChart2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground capitalize">
                            {session.type} —{" "}
                            {session.stack_focus ?? session.difficulty}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge
                              className={`text-xs ${
                                session.difficulty === "easy"
                                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                                  : session.difficulty === "medium"
                                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                    : "bg-red-500/20 text-red-400 border-red-500/30"
                              }`}>
                              {session.difficulty}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs capitalize">
                              {session.type}
                            </Badge>
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              {session.duration_min} min
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {session.status === "completed" &&
                          session.score_total != null && (
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">
                                {t("interviews.score")}
                              </p>
                              <p
                                className={`text-lg font-bold ${isPassed ? "text-green-500" : "text-warning"}`}>
                                {session.score_total}/100
                              </p>
                            </div>
                          )}
                        <Badge
                          className={`text-xs ${
                            statusLabel === t("interviews.statusPass")
                              ? "bg-green-500/20 text-green-400"
                              : statusLabel === t("interviews.statusReview")
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-blue-500/20 text-blue-400"
                          }`}>
                          {statusLabel}
                        </Badge>
                        {session.status === "in_progress" && (
                          <button
                            onClick={() => resumeSession(session.id)}
                            disabled={isResuming}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 cursor-pointer">
                            {isResuming ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <RotateCcw className="w-3 h-3" />
                            )}
                            {t("interviews.resume")}
                          </button>
                        )}
                        {session.status === "completed" && (
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/interviews/${session.id}/report`,
                              )
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer">
                            <FileText className="w-3 h-3" />
                            {t("interviews.report")}
                          </button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
