"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Briefcase, Loader2, LogOut, Mic, Sparkles } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/page-loader";
import { VoiceStatusOrb, ConversationTranscript } from "@/components/interview/voice";
import { useVoiceRoomEngine } from "@/lib/hooks/useVoiceRoomEngine";
import { useT } from "@/lib/i18n/useTranslation";

interface VoiceRoomPageProps {
  params: Promise<{ id: string }>;
}

export default function VoiceInterviewRoomPage({ params }: VoiceRoomPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useT();

  const {
    room,
    turns,
    callState,
    progress,
    micError,
    isEngineReady,
    isLoadingRoom,
    isCompleting,
    initEngine,
    completeRoom,
  } = useVoiceRoomEngine(id);

  // Une salle déjà terminée n'a rien à faire ici — direction le rapport.
  useEffect(() => {
    if (room?.status === "completed") {
      router.replace(`/dashboard/interviews/voice/${id}/report`);
    }
  }, [room?.status, id, router]);

  if (isLoadingRoom && !room) {
    return <PageLoader fullScreen />;
  }

  if (!room || room.status !== "in_progress") {
    return null;
  }

  const canFinish = callState === "listening" || callState === "ended";

  return (
    <div className="h-screen flex flex-col bg-background">
      <DashboardHeader showSearch={false} />

      <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-6 py-6 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {room.job_posting ? (
              <>
                <Briefcase className="w-4 h-4" />
                {room.job_posting.title}
                {room.job_posting.company_name ? ` — ${room.job_posting.company_name}` : ""}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {t("voiceInterview.freeTraining")}
              </>
            )}
          </div>
          {progress && (
            <span className="text-xs font-mono text-muted-foreground">
              {t("voiceInterview.turnLabel")} {progress.current}/{progress.total}
            </span>
          )}
        </div>

        {!isEngineReady && !micError && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
              <Mic className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">{t("voiceInterview.readyTitle")}</h2>
              <p className="text-sm text-muted-foreground max-w-sm">{t("voiceInterview.readyDesc")}</p>
            </div>
            <Button onClick={() => initEngine()} className="h-11 px-6 cursor-pointer">
              <Mic className="mr-2 h-4 w-4" />
              {t("voiceInterview.enableMic")}
            </Button>
          </div>
        )}

        {micError && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <AlertCircle className="w-10 h-10 text-destructive" />
            <p className="text-sm text-muted-foreground max-w-sm">{micError}</p>
            <Button variant="outline" onClick={() => initEngine()} className="cursor-pointer">
              {t("voiceInterview.retry")}
            </Button>
          </div>
        )}

        {isEngineReady && !micError && (
          <>
            <ConversationTranscript turns={turns} />

            <div className="border-t border-border/30 pt-6 flex flex-col items-center gap-6">
              <VoiceStatusOrb callState={callState} />

              <Button
                variant="outline"
                disabled={!canFinish || isCompleting}
                onClick={() => completeRoom()}
                className="text-muted-foreground cursor-pointer">
                {isCompleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("voiceInterview.generatingReport")}
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("voiceInterview.endInterview")}
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
