"use client"

import { Logo } from "@/components/skillforge"
import { Clock, Sun, Globe, Lightbulb, ChevronDown } from "lucide-react"
import Link from "next/link"

interface InterviewHeaderProps {
  timeRemaining: string
}

export function InterviewHeader({ timeRemaining }: InterviewHeaderProps) {
  return (
    <header className="h-14 border-b border-border bg-background px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Logo href="/dashboard" />
        <div className="h-6 w-px bg-border" />
        <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="font-mono text-sm text-foreground">{timeRemaining}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <Sun className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg border border-border text-sm">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground">EN</span>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Lightbulb className="w-4 h-4" />
          Ask for Hint
        </button>
        <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors">
          Submit Code
        </button>
      </div>
    </header>
  )
}
