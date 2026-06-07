import { cn } from "@/lib/utils"

interface SkillBadgeProps {
  label: string
  variant?: "default" | "primary" | "success" | "warning" | "outline"
  size?: "sm" | "md"
  className?: string
}

export function SkillBadge({ 
  label, 
  variant = "default", 
  size = "sm",
  className 
}: SkillBadgeProps) {
  const variants = {
    default: "bg-secondary text-secondary-foreground",
    primary: "bg-primary/20 text-primary border border-primary/30",
    success: "bg-success/20 text-success border border-success/30",
    warning: "bg-warning/20 text-warning border border-warning/30",
    outline: "border border-border bg-transparent text-muted-foreground"
  }

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm"
  }

  return (
    <span 
      className={cn(
        "rounded-md font-medium inline-flex items-center",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {label}
    </span>
  )
}
