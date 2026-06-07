"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInterview } from "@/lib/hooks/useInterview";
import { useInterviewStore } from "@/lib/stores/interviewStore";
import { InterviewHeader } from "@/components/interview";
import { Loader2, Play, CheckCircle, Lightbulb, Send } from "lucide-react";
import { toast } from "sonner";

export default function InterviewSessionPage() {
  const router = useRouter();
  const { currentSession, currentQuestion, lastResult, respond, getHint, complete, isResponding, isGettingHint, isCompleting, hint } = useInterview();
  const [code, setCode] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!currentSession) {
      router.push("/dashboard/interviews");
    }
  }, [currentSession, router]);

  if (!currentSession) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const isCodeQuestion = currentQuestion?.type === "coding";
  const timeTakenSec = Math.round((Date.now() - startTime) / 1000);

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

  const progress = currentSession.progress;
  const timeRemaining = `${currentSession.duration_min}:00`;

  return (
    <div className="h-screen flex flex-col bg-background">
      <InterviewHeader timeRemaining={timeRemaining} />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem */}
        <div className="w-80 lg:w-96 border-r border-border overflow-auto p-4 space-y-4">
          {/* Progress */}
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground font-medium">
                {progress.current}/{progress.total}
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>

          {currentQuestion ? (
            <div className="bg-card border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                  currentQuestion.difficulty === "easy" ? "bg-green-500/20 text-green-400" :
                  currentQuestion.difficulty === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-red-500/20 text-red-400"
                }`}>
                  {currentQuestion.difficulty.toUpperCase()}
                </span>
                <span className="text-xs text-muted-foreground capitalize">{currentQuestion.type}</span>
              </div>
              <h3 className="font-semibold text-foreground">{currentQuestion.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentQuestion.description}
              </p>
              {currentQuestion.constraints && (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Contraintes :</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {currentQuestion.constraints}
                  </p>
                </div>
              )}
              {currentQuestion.examples.length > 0 && (
                <div className="pt-2 border-t border-border space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Exemples :</p>
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
                <h3 className="font-semibold text-foreground">Réponse soumise !</h3>
              </div>
              <div className="text-2xl font-bold text-foreground">{lastResult.score}/100</div>
              <p className="text-sm text-muted-foreground">{lastResult.feedback}</p>
              {lastResult.is_last && (
                <button
                  onClick={handleComplete}
                  disabled={isCompleting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50">
                  {isCompleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Terminer la session
                </button>
              )}
            </div>
          ) : null}

          {/* Hint */}
          {hint && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
              <p className="text-xs font-medium text-warning mb-1 flex items-center gap-1">
                <Lightbulb className="w-3 h-3" /> Indice
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
                {isCodeQuestion ? "Code Editor" : "Text Answer"}
              </span>
              {isCodeQuestion && (
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-xs bg-secondary border border-border rounded px-2 py-1 text-foreground">
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
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-lg text-muted-foreground hover:bg-secondary transition-colors disabled:opacity-40">
                {isGettingHint ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Lightbulb className="w-3 h-3" />
                )}
                Hint ({currentQuestion?.hints_count ?? 0})
              </button>
              <button
                onClick={handleSubmit}
                disabled={isResponding || !currentQuestion || (!code && !textAnswer)}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50">
                {isResponding ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Send className="w-3 h-3" />
                )}
                Submit
              </button>
            </div>
          </div>

          {isCodeQuestion ? (
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Write your solution here..."
              className="flex-1 p-4 bg-background text-foreground font-mono text-sm resize-none focus:outline-none"
              spellCheck={false}
            />
          ) : (
            <textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="Rédigez votre réponse ici..."
              className="flex-1 p-4 bg-background text-foreground text-sm resize-none focus:outline-none leading-relaxed"
            />
          )}
        </div>

        {/* Right Panel - AI Feedback */}
        <div className="w-80 lg:w-96 border-l border-border flex flex-col bg-card">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Play className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Stitch AI Coach</h3>
                <p className="text-xs text-muted-foreground">SkillForge Engineering</p>
              </div>
              <div className="ml-auto w-2 h-2 rounded-full bg-success" />
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-3">
            {lastResult ? (
              <>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Verdict</p>
                  <p className="text-sm font-semibold text-foreground">{lastResult.verdict}</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Feedback</p>
                  <p className="text-sm text-foreground leading-relaxed">{lastResult.feedback}</p>
                </div>
                {lastResult.strengths.length > 0 && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-xs font-medium text-green-500 mb-2">Points forts</p>
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
                    <p className="text-xs font-medium text-warning mb-2">À améliorer</p>
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
                    <p className="text-xs font-medium text-muted-foreground mb-1">Réponse modèle</p>
                    <p className="text-xs text-foreground font-mono leading-relaxed whitespace-pre-wrap">
                      {lastResult.model_answer}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-sm text-foreground leading-relaxed">
                  Soumettez votre réponse pour recevoir le feedback du coach IA.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-8 border-t border-border bg-card px-4 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span>SYSTEM ONLINE</span>
          </div>
          <span>Session: {currentSession.id.slice(0, 8)}</span>
          <span>Type: {currentSession.type}</span>
        </div>
        <span>© 2026 SkillForge Platform.</span>
      </div>
    </div>
  );
}
