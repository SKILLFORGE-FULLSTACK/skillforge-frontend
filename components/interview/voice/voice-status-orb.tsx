"use client";

import { Bot, Loader2, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/useTranslation";
import type { VoiceCallState } from "@/lib/stores/voiceInterviewStore";

interface VoiceStatusOrbProps {
  callState: VoiceCallState;
}

const STATUS_CONFIG: Record<
  VoiceCallState,
  { labelKey: string; icon: typeof Mic; ring: string; icon_color: string }
> = {
  idle: { labelKey: "voiceInterview.statusIdle", icon: MicOff, ring: "ring-muted-foreground/20", icon_color: "text-muted-foreground" },
  listening: { labelKey: "voiceInterview.statusListening", icon: Mic, ring: "ring-accent/60 animate-pulse", icon_color: "text-accent" },
  processing: { labelKey: "voiceInterview.statusProcessing", icon: Loader2, ring: "ring-accent-secondary/60", icon_color: "text-accent-secondary" },
  ai_speaking: { labelKey: "voiceInterview.statusAiSpeaking", icon: Bot, ring: "ring-primary/60 animate-pulse", icon_color: "text-primary" },
  ended: { labelKey: "voiceInterview.statusEnded", icon: Bot, ring: "ring-green-500/50", icon_color: "text-green-500" },
};

export function VoiceStatusOrb({ callState }: VoiceStatusOrbProps) {
  const { t } = useT();
  const config = STATUS_CONFIG[callState];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={cn(
          "w-32 h-32 rounded-full bg-card border border-border/50 flex items-center justify-center ring-4 transition-all duration-300",
          config.ring,
        )}>
        <Icon className={cn("w-12 h-12", config.icon_color, callState === "processing" && "animate-spin")} />
      </div>
      <p className="text-sm font-medium text-muted-foreground">{t(config.labelKey)}</p>
    </div>
  );
}
