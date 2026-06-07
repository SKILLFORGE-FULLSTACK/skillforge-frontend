import { ProgressBar } from "@/components/skillforge"
import { ClipboardList } from "lucide-react"

interface Criterion {
  name: string
  weight: number
  variant: "primary" | "success" | "warning" | "destructive"
}

interface EvaluationCriteriaProps {
  criteria: Criterion[]
}

export function EvaluationCriteria({ criteria }: EvaluationCriteriaProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/20 rounded-lg">
          <ClipboardList className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Evaluation Criteria</h2>
      </div>

      <div className="space-y-4">
        {criteria.map((criterion, index) => (
          <ProgressBar
            key={index}
            value={criterion.weight}
            label={criterion.name}
            variant={criterion.variant}
          />
        ))}
      </div>
    </div>
  )
}
