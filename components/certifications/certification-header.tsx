import { ProgressBar } from "@/components/skillforge"
import { Star, Clock, FileText, Link as LinkIcon, Globe, Play } from "lucide-react"

interface CertificationHeaderProps {
  level: number
  title: string
  category: string
  passScore: number
  daysRemaining: number
}

export function CertificationHeader({
  level,
  title,
  category,
  passScore,
  daysRemaining
}: CertificationHeaderProps) {
  return (
    <div className="flex gap-6 mb-8">
      {/* Level Card */}
      <div className="w-48 bg-card border border-border rounded-xl p-6 flex flex-col items-center">
        <div className="w-16 h-16 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center mb-4">
          <Play className="w-8 h-8 text-primary" />
        </div>
        <div className="text-sm text-muted-foreground mb-1">LVL</div>
        <div className="text-2xl font-bold text-primary">{level}</div>
        <button className="mt-4 px-6 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
          INTERMÉDIAIRE
        </button>
      </div>

      {/* Title and meta */}
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>CERTIFICATIONS</span>
          <span className="text-primary">›</span>
          <span className="text-primary uppercase">{category}</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">{title}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg">
            <Star className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-foreground">{passScore}/100</span>
            <span className="text-sm text-muted-foreground">Pass Score</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-warning/20 text-warning rounded-lg">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{daysRemaining} days remaining</span>
          </div>
        </div>
      </div>
    </div>
  )
}
