"use client"

import { cn } from "@/lib/utils"

interface ContributionDay {
  date: string
  count: number
}

interface ContributionHeatmapProps {
  data: ContributionDay[]
  months?: string[]
  className?: string
}

export function ContributionHeatmap({ 
  data, 
  months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"],
  className 
}: ContributionHeatmapProps) {
  const getColorClass = (count: number) => {
    if (count === 0) return "bg-secondary/30"
    if (count <= 2) return "bg-primary/30"
    if (count <= 4) return "bg-primary/50"
    if (count <= 6) return "bg-primary/70"
    return "bg-primary"
  }

  const weeks = Math.ceil(data.length / 7)
  const grid: (ContributionDay | null)[][] = []
  
  for (let w = 0; w < weeks; w++) {
    const week: (ContributionDay | null)[] = []
    for (let d = 0; d < 7; d++) {
      const index = w * 7 + d
      week.push(index < data.length ? data[index] : null)
    }
    grid.push(week)
  }

  return (
    <div className={cn("", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Contribution Heatmap</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-0.5">
              <div className="w-3 h-3 rounded-sm bg-secondary/30" />
              <div className="w-3 h-3 rounded-sm bg-primary/30" />
              <div className="w-3 h-3 rounded-sm bg-primary/50" />
              <div className="w-3 h-3 rounded-sm bg-primary" />
            </div>
            <span>More</span>
          </div>
          <button className="px-3 py-1 text-xs border border-border rounded-md text-muted-foreground hover:bg-secondary">
            Last 6 Months
          </button>
        </div>
      </div>
      
      <div className="flex gap-1">
        {grid.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={cn(
                  "w-3 h-3 rounded-sm",
                  day ? getColorClass(day.count) : "bg-transparent"
                )}
                title={day ? `${day.date}: ${day.count} contributions` : ""}
              />
            ))}
          </div>
        ))}
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        {months.map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>
    </div>
  )
}
