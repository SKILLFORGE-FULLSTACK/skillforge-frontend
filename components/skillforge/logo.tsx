import Link from "next/link"

interface LogoProps {
  href?: string
  showSubtitle?: boolean
  subtitle?: string
  className?: string
}

export function Logo({ 
  href = "/", 
  showSubtitle = false, 
  subtitle = "Engineering Hub",
  className = "" 
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
    return <Link href={href}>{content}</Link>
  }

  return content
}
