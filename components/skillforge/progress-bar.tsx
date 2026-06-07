import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  variant?: "default" | "primary" | "success" | "warning" | "destructive"
  size?: "sm" | "md"
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  variant = "primary",
  size = "md",
  className
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  const variants = {
    default: "bg-foreground",
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive"
  }

  const sizes = {
    sm: "h-1.5",
    md: "h-2"
  }

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between mb-1">
          {label && <span className="text-sm text-foreground">{label}</span>}
          {showPercentage && (
            <span className="text-sm text-primary font-medium">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={cn("w-full bg-secondary rounded-full overflow-hidden", sizes[size])}>
        <div
          className={cn("h-full rounded-full transition-all duration-300", variants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
