import Link from "next/link"
import type { MouseEventHandler } from "react"

interface LogoProps {
  href?: string
  showSubtitle?: boolean
  subtitle?: string
  className?: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

export function Logo({ 
  href = "/", 
  showSubtitle = false, 
  subtitle = "Engineering Hub",
  className = "",
  onClick,
}: LogoProps) {
  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xl font-bold text-primary">SkillForge</span>
      {showSubtitle && (
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      )}
    </div>
  )

  if (href) {
    return <Link href={href} onClick={onClick}>{content}</Link>
  }

  return content
}
