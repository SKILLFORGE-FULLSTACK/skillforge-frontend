import { SkillBadge } from "@/components/skillforge"

interface ProblemPanelProps {
  difficulty: "EASY" | "MEDIUM" | "HARD"
  category: string
  title: string
  description: string
  constraints: string[]
  example: {
    input: string
    output: string
    image?: string
  }
}

export function ProblemPanel({
  difficulty,
  category,
  title,
  description,
  constraints,
  example
}: ProblemPanelProps) {
  const difficultyVariant: Record<
    string,
    "default" | "primary" | "success" | "warning" | "outline"
  > = {
    EASY: "success",
    MEDIUM: "warning",
    HARD: "outline",
  };

  return (
    <div className="h-full overflow-auto p-6 bg-background">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <SkillBadge label={difficulty} variant={difficultyVariant[difficulty]} />
        <span className="text-sm text-muted-foreground">{category}</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-foreground mb-6">{title}</h1>

      {/* Description */}
      <div className="mb-6">
        <h2 className="text-sm uppercase tracking-wider text-accent mb-3">DESCRIPTION</h2>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>

      {/* Constraints */}
      <div className="mb-6">
        <h2 className="text-sm uppercase tracking-wider text-accent mb-3">CONSTRAINTS</h2>
        <ul className="space-y-2">
          {constraints.map((constraint, index) => (
            <li key={index} className="flex items-start gap-2 text-muted-foreground">
              <span className="text-primary">•</span>
              <span className="font-mono text-sm">{constraint}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Example */}
      <div>
        <h2 className="text-sm uppercase tracking-wider text-accent mb-3">EXAMPLE 1</h2>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {example.image && (
            <div className="p-4 bg-secondary/30 flex items-center justify-center">
              <TreeVisualization />
            </div>
          )}
          <div className="p-4 font-mono text-sm bg-secondary/50">
            <div className="text-muted-foreground">
              <span className="text-accent">Input:</span> {example.input}
            </div>
            <div className="text-muted-foreground mt-1">
              <span className="text-accent">Output:</span> {example.output}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TreeVisualization() {
  return (
    <svg width="200" height="120" viewBox="0 0 200 120" className="text-primary">
      {/* Tree nodes */}
      <circle cx="100" cy="20" r="16" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
      <text x="100" y="25" textAnchor="middle" className="text-xs fill-current">3</text>
      
      <circle cx="50" cy="60" r="16" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
      <text x="50" y="65" textAnchor="middle" className="text-xs fill-current">9</text>
      
      <circle cx="150" cy="60" r="16" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
      <text x="150" y="65" textAnchor="middle" className="text-xs fill-current">20</text>
      
      <circle cx="125" cy="100" r="16" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
      <text x="125" y="105" textAnchor="middle" className="text-xs fill-current">15</text>
      
      <circle cx="175" cy="100" r="16" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
      <text x="175" y="105" textAnchor="middle" className="text-xs fill-current">7</text>
      
      {/* Edges */}
      <line x1="85" y1="32" x2="62" y2="48" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
      <line x1="115" y1="32" x2="138" y2="48" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
      <line x1="140" y1="72" x2="130" y2="88" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
      <line x1="160" y1="72" x2="170" y2="88" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
    </svg>
  )
}
