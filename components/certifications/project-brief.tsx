import { FileText } from "lucide-react"

interface Requirement {
  title: string
  description: string
}

interface ProjectBriefProps {
  description: React.ReactNode
  requirements: Requirement[]
}

export function ProjectBrief({ description, requirements }: ProjectBriefProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-secondary rounded-lg">
          <FileText className="w-5 h-5 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Project Brief</h2>
      </div>
      
      <div className="text-muted-foreground mb-6 leading-relaxed">
        {description}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {requirements.map((req, index) => (
          <div key={index} className="bg-secondary/30 border border-border rounded-lg p-4">
            <h3 className="text-xs uppercase tracking-wider text-accent mb-2">{req.title}</h3>
            <p className="text-sm text-muted-foreground">{req.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
