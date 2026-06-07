"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Play, Clock, BarChart2, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useInterview } from "@/lib/hooks/useInterview";
import { useQuery } from "@tanstack/react-query";
import { interviewApi } from "@/lib/api";
import { StartInterviewPayload } from "@/lib/types";

const INTERVIEW_TYPES: Array<{ label: string; value: string; type: string; difficulty?: string }> = [
  { label: "Tous", value: "all", type: "all" },
  { label: "Algorithmes", value: "algorithmes", type: "technical", difficulty: "medium" },
  { label: "System Design", value: "system_design", type: "system_design", difficulty: "hard" },
  { label: "Frontend", value: "frontend", type: "technical", difficulty: "medium" },
  { label: "Backend", value: "backend", type: "technical", difficulty: "medium" },
  { label: "Comportemental", value: "behavioral", type: "behavioral", difficulty: "easy" },
];

export function InterviewsListContent() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const { startSession, isStarting } = useInterview();

  const { data: history, isLoading, error } = useQuery({
    queryKey: ["interviews"],
    queryFn: () => interviewApi.getHistory({ page: 1 }),
  });

  const filtered = history?.data.filter((s) => {
    const matchSearch =
      !search ||
      s.type.toLowerCase().includes(search.toLowerCase()) ||
      (s.stack_focus ?? "").toLowerCase().includes(search.toLowerCase());
    const matchCat =
      activeCategory === "all" || s.type === INTERVIEW_TYPES.find((t) => t.value === activeCategory)?.type;
    return matchSearch && matchCat;
  }) ?? [];

  const handleStart = (cat: (typeof INTERVIEW_TYPES)[number]) => {
    if (cat.value === "all") return;
    const payload: StartInterviewPayload = {
      type: cat.type,
      difficulty: cat.difficulty ?? "medium",
      mode: "standard",
    };
    startSession(payload);
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Entraînement Entretiens</h1>
          <p className="text-muted-foreground">Préparez-vous avec notre coach IA</p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90"
          disabled={isStarting}
          onClick={() => startSession({ type: "technical", difficulty: "medium", mode: "standard" })}>
          {isStarting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Play className="w-4 h-4 mr-2" />
          )}
          Nouveau Mock Interview
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans l'historique..."
            className="pl-10 bg-muted border-border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filtres
        </Button>
      </div>

      {/* Start New Session — type selection */}
      <div className="bg-card border border-border rounded-xl p-4 mb-6">
        <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Démarrer un nouvel entretien
        </h2>
        <div className="flex flex-wrap gap-2">
          {INTERVIEW_TYPES.filter((t) => t.value !== "all").map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleStart(cat)}
              disabled={isStarting}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-secondary hover:border-primary/50 transition-colors disabled:opacity-50">
              <Play className="w-3.5 h-3.5 text-primary" />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {INTERVIEW_TYPES.map((cat) => (
          <Button
            key={cat.value}
            variant={activeCategory === cat.value ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat.value)}
            className={activeCategory === cat.value ? "bg-primary" : ""}>
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          <AlertCircle className="w-5 h-5" />
          <span>Erreur lors du chargement de l'historique.</span>
        </div>
      )}

      {/* History List */}
      {!isLoading && !error && (
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <BarChart2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Aucun entretien dans l'historique.</p>
              <p className="text-sm mt-1">Démarrez votre premier mock interview !</p>
            </div>
          ) : (
            filtered.map((session) => {
              const isPassed = session.status === "completed" && (session.score_total ?? 0) >= 70;
              const statusLabel =
                session.status === "completed"
                  ? isPassed
                    ? "PASS"
                    : "NEEDS REVIEW"
                  : "IN PROGRESS";

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
                            {session.type} — {session.stack_focus ?? session.difficulty}
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
                            <Badge variant="outline" className="text-xs capitalize">
                              {session.type}
                            </Badge>
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              {session.duration_min} min
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {session.status === "completed" && session.score_total != null && (
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Score</p>
                            <p
                              className={`text-lg font-bold ${
                                isPassed ? "text-green-500" : "text-warning"
                              }`}>
                              {session.score_total}/100
                            </p>
                          </div>
                        )}
                        <Badge
                          className={`text-xs ${
                            statusLabel === "PASS"
                              ? "bg-green-500/20 text-green-400"
                              : statusLabel === "NEEDS REVIEW"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}>
                          {statusLabel}
                        </Badge>
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
