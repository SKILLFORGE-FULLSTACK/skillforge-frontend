import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  trend?: {
    value: string
    positive?: boolean
  }
  className?: string
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className
}: StatCardProps) {
  return (
    <div className={cn(
      "bg-card border border-border rounded-lg p-4 flex items-center gap-4",
      className
    )}>
      {Icon && (
        <div className="p-3 rounded-lg bg-secondary">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
      )}
      <div className="flex-1">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {trend && (
        <div className={cn(
          "text-sm font-medium",
          trend.positive ? "text-success" : "text-destructive"
        )}>
          {trend.value}
        </div>
      )}
    </div>
  )
}
