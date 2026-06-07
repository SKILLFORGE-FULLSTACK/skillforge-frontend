import Image from "next/image"
import { cn } from "@/lib/utils"
import { SkillBadge } from "./skill-badge"

interface CandidateCardProps {
  name: string
  role: string
  avatar?: string
  username?: string
  skills: string[]
  level?: number
  levelLabel?: string
  isConfidential?: boolean
  className?: string
  onViewProfile?: () => void
  onSave?: () => void
}

export function CandidateCard({
  name,
  role,
  avatar,
  username,
  skills,
  level,
  levelLabel,
  isConfidential = false,
  className,
  onViewProfile,
  onSave
}: CandidateCardProps) {
  return (
    <div className={cn(
      "bg-card border border-border rounded-lg p-4",
      className
    )}>
      <div className="flex items-start gap-3 mb-3">
        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-secondary">
          {avatar ? (
            <Image src={avatar} alt={name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-lg font-semibold text-muted-foreground">
              {name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-foreground">{name}</h4>
          <p className="text-sm text-primary">{role}</p>
          {username && (
            <p className="text-xs text-muted-foreground">{username}</p>
          )}
          {isConfidential && (
            <p className="text-xs text-accent">Confidential Candidate</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {skills.slice(0, 4).map((skill) => (
          <SkillBadge key={skill} label={skill} variant="outline" />
        ))}
      </div>

      {(level !== undefined || levelLabel) && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-muted-foreground">{levelLabel}</span>
          {level !== undefined && (
            <>
              <span className="text-sm text-muted-foreground">⊙</span>
              <span className="text-sm font-medium text-foreground">L{level}</span>
            </>
          )}
          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${(level || 0) * 10}%` }} />
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button 
          onClick={onViewProfile}
          className="flex-1 px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          View Profile
        </button>
        <button 
          onClick={onSave}
          className="p-2 border border-border rounded-lg hover:bg-secondary transition-colors"
        >
          <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
