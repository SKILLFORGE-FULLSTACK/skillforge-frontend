"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInterview } from "@/lib/hooks/useInterview";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Loader2, Play, CheckCircle, Lightbulb, Send } from "lucide-react";
import { PageLoader } from "@/components/ui/page-loader";
import { useT } from "@/lib/i18n/useTranslation";

export default function InterviewSessionPage() {
  const router = useRouter();
  const {
    currentSession,
    currentQuestion,
    lastResult,
    respond,
    getHint,
    complete,
    isResponding,
    isGettingHint,
    isCompleting,
    hint,
  } = useInterview();
  const [code, setCode] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [startTime] = useState(Date.now());
  const { t } = useT();

  const totalTime = (currentSession?.duration_min ?? 30) * 60;
  const [timeLeft, setTimeLeft] = useState(totalTime);

  useEffect(() => {
    if (!currentSession) return;
    setTimeLeft((currentSession.duration_min ?? 30) * 60);
  }, [currentSession?.id]);

  useEffect(() => {
    if (!currentSession) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentSession?.id]);

  useEffect(() => {
    if (!currentSession) {
      router.push("/dashboard/interviews");
    }
  }, [currentSession, router]);

  if (!currentSession) {
    return <PageLoader fullScreen />;
  }

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");
  const ratio = timeLeft / totalTime;
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference * (1 - ratio);

  const timerColorClass =
    ratio > 0.5
      ? "text-success"
      : ratio > 0.25
        ? "text-warning"
        : "text-destructive";
  const timerStroke =
    ratio > 0.5
      ? "oklch(0.7 0.18 145)"
      : ratio > 0.25
        ? "oklch(0.75 0.18 75)"
        : "oklch(0.6 0.22 25)";
  const timerBorderClass =
    ratio > 0.5
      ? "border-success/30 bg-success/5"
      : ratio > 0.25
        ? "border-warning/30 bg-warning/5"
        : "border-destructive/30 bg-destructive/5";
  const isUrgent = ratio <= 0.25;

  const isCodeQuestion = currentQuestion?.type === "coding";
  const timeTakenSec = Math.round((Date.now() - startTime) / 1000);
  const progress = currentSession.progress;

  const handleSubmit = () => {
    if (!currentQuestion) return;
    respond({
      sessionId: currentSession.id,
      payload: {
        question_id: currentQuestion.id,
        text_answer: textAnswer || undefined,
        code_submitted: code || undefined,
        language: isCodeQuestion ? language : undefined,
        time_taken_sec: timeTakenSec,
      },
    });
    setCode("");
    setTextAnswer("");
  };

  const handleHint = () => {
    if (!currentQuestion) return;
    getHint({
      sessionId: currentSession.id,
      questionId: currentQuestion.id,
      partialAnswer: code || textAnswer || undefined,
    });
  };

  const handleComplete = () => {
    complete(currentSession.id);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <DashboardHeader showSearch={false} />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-80 lg:w-96 border-r border-border overflow-auto p-4 space-y-4">

          {/* ── Countdown Timer ─────────────────────────── */}
          <div className={`flex flex-col items-center gap-3 p-4 rounded-xl border ${timerBorderClass} transition-colors duration-1000`}>
            <div className="relative">
              {/* Pulsing ring when urgent */}
              {isUrgent && (
                <div className="absolute inset-0 rounded-full bg-destructive/20 animate-ping" />
              )}
              <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
                {/* Track */}
                <circle
                  cx="50" cy="50" r="36"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-border"
                />
                {/* Progress */}
                <circle
                  cx="50" cy="50" r="36"
                  fill="none"
                  stroke={timerStroke}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              {/* Time text inside ring */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-2xl font-mono font-bold leading-none ${timerColorClass}`}>
                  {minutes}:{seconds}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
              <span>{currentSession.type.replace("_", " ").toUpperCase()}</span>
              <span>·</span>
              <span>{currentSession.difficulty.toUpperCase()}</span>
            </div>
          </div>

          {/* ── Progress ────────────────────────────────── */}
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Question
              </span>
              <span className="text-sm font-bold font-mono text-foreground">
                {progress.current}
                <span className="text-muted-foreground font-normal"> / {progress.total}</span>
              </span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>

          {/* ── Current Question ────────────────────────── */}
          {currentQuestion ? (
            <div className="bg-card border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded font-mono font-medium ${
                  currentQuestion.difficulty === "easy"
                    ? "bg-green-500/20 text-green-400"
                    : currentQuestion.difficulty === "medium"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                }`}>
                  {currentQuestion.difficulty.toUpperCase()}
                </span>
                <span className="text-xs text-muted-foreground capitalize">
                  {currentQuestion.type.replace("_", " ")}
                </span>
              </div>
              <h3 className="font-semibold text-foreground">{currentQuestion.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentQuestion.description}
              </p>
              {currentQuestion.constraints && (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    {t("session.constraints")}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {currentQuestion.constraints}
                  </p>
                </div>
              )}
              {currentQuestion.examples.length > 0 && (
                <div className="pt-2 border-t border-border space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    {t("session.examples")}
                  </p>
                  {currentQuestion.examples.map((ex, i) => (
                    <div key={i} className="text-xs bg-secondary/50 rounded p-2 font-mono">
                      <span className="text-muted-foreground">Input: </span>
                      <span className="text-foreground">{ex.input}</span>
                      <br />
                      <span className="text-muted-foreground">Output: </span>
                      <span className="text-foreground">{ex.output}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : lastResult ? (
            <div className="bg-card border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-foreground">{t("session.submitted")}</h3>
              </div>
              <div className="text-2xl font-bold text-foreground font-mono">
                {lastResult.score}/100
              </div>
              <p className="text-sm text-muted-foreground">{lastResult.feedback}</p>
              {lastResult.is_last && (
                <button
                  onClick={handleComplete}
                  disabled={isCompleting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 cursor-pointer">
                  {isCompleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {t("session.endSession")}
                </button>
              )}
            </div>
          ) : null}

          {/* ── Hint ────────────────────────────────────── */}
          {hint && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
              <p className="text-xs font-medium text-warning mb-1 flex items-center gap-1">
                <Lightbulb className="w-3 h-3" /> {t("session.hint")}
              </p>
              <p className="text-sm text-foreground">{hint}</p>
            </div>
          )}
        </div>

        {/* Center - Editor / Answer */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-border px-4 py-2 flex items-center justify-between bg-card">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">
                {isCodeQuestion ? t("session.codeEditor") : t("session.textAnswer")}
              </span>
              {isCodeQuestion && (
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-xs bg-secondary border border-border rounded px-2 py-1 text-foreground cursor-pointer">
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="go">Go</option>
                  <option value="php">PHP</option>
                </select>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleHint}
                disabled={isGettingHint || !currentQuestion || currentQuestion.hints_count === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-lg text-muted-foreground hover:bg-secondary transition-colors disabled:opacity-40 cursor-pointer">
                {isGettingHint ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Lightbulb className="w-3 h-3" />
                )}
                {t("session.hintBtn")} ({currentQuestion?.hints_count ?? 0})
              </button>
              <button
                onClick={handleSubmit}
                disabled={isResponding || !currentQuestion || (!code && !textAnswer)}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 cursor-pointer">
                {isResponding ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Send className="w-3 h-3" />
                )}
                {t("session.submit")}
              </button>
            </div>
          </div>

          {isCodeQuestion ? (
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t("session.codePlaceholder")}
              className="flex-1 p-4 bg-background text-foreground font-mono text-sm resize-none focus:outline-none"
              spellCheck={false}
            />
          ) : (
            <textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder={t("session.textPlaceholder")}
              className="flex-1 p-4 bg-background text-foreground text-sm resize-none focus:outline-none leading-relaxed"
            />
          )}
        </div>

        {/* Right Panel - AI Coach */}
        <div className="w-80 lg:w-96 border-l border-border flex flex-col bg-card">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Play className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{t("session.aiCoach")}</h3>
                <p className="text-xs text-muted-foreground">SkillForge Engineering</p>
              </div>
              <div className="ml-auto w-2 h-2 rounded-full bg-success" />
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-3">
            {lastResult ? (
              <>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    {t("session.verdict")}
                  </p>
                  <p className="text-sm font-semibold text-foreground">{lastResult.verdict}</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    {t("session.feedback")}
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">{lastResult.feedback}</p>
                </div>
                {lastResult.strengths.length > 0 && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-xs font-medium text-green-500 mb-2">
                      {t("session.strengths")}
                    </p>
                    <ul className="space-y-1">
                      {lastResult.strengths.map((s, i) => (
                        <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                          <span className="text-green-500 mt-0.5">✓</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {lastResult.weaknesses.length > 0 && (
                  <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <p className="text-xs font-medium text-warning mb-2">
                      {t("session.weaknesses")}
                    </p>
                    <ul className="space-y-1">
                      {lastResult.weaknesses.map((w, i) => (
                        <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                          <span className="text-warning mt-0.5">!</span> {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {lastResult.model_answer && (
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      {t("session.modelAnswer")}
                    </p>
                    <p className="text-xs text-foreground font-mono leading-relaxed whitespace-pre-wrap">
                      {lastResult.model_answer}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-sm text-foreground leading-relaxed">
                  {t("session.awaitFeedback")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="h-8 border-t border-border bg-card px-4 flex items-center justify-between text-xs text-muted-foreground font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span>{t("session.systemOnline")}</span>
          </div>
          <span>{t("session.sessionLabel")}: {currentSession.id.slice(0, 8)}</span>
          <span>{t("session.typeLabel")}: {currentSession.type}</span>
        </div>
        <span>© 2026 SkillForge Platform.</span>
      </div>
    </div>
  );
}
