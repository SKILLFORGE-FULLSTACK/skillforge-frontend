"use client";

import { useEffect, useRef } from "react";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VoiceInterviewTurn } from "@/lib/types";

interface ConversationTranscriptProps {
  turns: VoiceInterviewTurn[];
}

export function ConversationTranscript({ turns }: ConversationTranscriptProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns.length]);

  return (
    <div className="flex-1 overflow-y-auto space-y-4 px-1 py-4">
      {turns.map((turn) => {
        const isAi = turn.speaker === "ai";
        return (
          <div key={turn.id} className={cn("flex gap-3", !isAi && "flex-row-reverse")}>
            <div
              className={cn(
                "w-8 h-8 shrink-0 rounded-full flex items-center justify-center",
                isAi ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent",
              )}>
              {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div
              className={cn(
                "max-w-[75%] rounded-xl px-4 py-2.5 text-sm leading-relaxed",
                isAi
                  ? "bg-card border border-border/50 text-foreground"
                  : "bg-accent/10 text-foreground",
              )}>
              {turn.transcript || <span className="italic text-muted-foreground">…</span>}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
