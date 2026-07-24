"use client"

import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n/useTranslation"

interface ScoreCircleProps {
  score: number
  maxScore: number
  size?: "sm" | "md" | "lg"
  label?: string
  showChange?: boolean
  changePercent?: number
  className?: string
}

export function ScoreCircle({
  score,
  maxScore,
  size = "md",
  label,
  showChange = false,
  changePercent,
  className
}: ScoreCircleProps) {
  const { t } = useT()
  const percentage = (score / maxScore) * 100
  const circumference = 2 * Math.PI * 45

  const sizes = {
    sm: { container: "w-20 h-20", text: "text-xl", label: "text-xs" },
    md: { container: "w-32 h-32", text: "text-4xl", label: "text-sm" },
    lg: { container: "w-40 h-40", text: "text-5xl", label: "text-base" }
  }

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className={cn("relative", sizes[size].container)}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            className="text-secondary"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (percentage / 100) * circumference}
            strokeLinecap="round"
            className="text-primary transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold text-foreground", sizes[size].text)}>
            {score}
          </span>
          {label && (
            <span className={cn("text-muted-foreground", sizes[size].label)}>
              {label}
            </span>
          )}
        </div>
      </div>
      {showChange && changePercent !== undefined && (
        <div className={cn(
          "flex items-center gap-1 text-sm",
          changePercent >= 0 ? "text-success" : "text-destructive"
        )}>
          <span>{changePercent >= 0 ? "↗" : "↘"}</span>
          <span>{changePercent >= 0 ? "+" : ""}{changePercent}% {t("dashboard.vsLastMonth")}</span>
        </div>
      )}
    </div>
  )
}
