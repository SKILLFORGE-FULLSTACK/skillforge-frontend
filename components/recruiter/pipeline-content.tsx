import {
  Users,
  Zap,
  TrendingUp,
  MessageSquare,
  Eye,
  MoreHorizontal,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { SkillBadge } from "@/components/skillforge";

// ─── TYPES ──────────────────────────────────────────────────────
type Candidate = {
  name: string;
  role: string;
  skills: string[];
  level: number;
  levelColor: string;
  status?: string;
  upcomingRound?: string;
};

type PipelineColumn = {
  title: string;
  count: number;
  candidates: Candidate[];
};

// ─── DATA ───────────────────────────────────────────────────────
const pipelineColumns: PipelineColumn[] = [
  {
    title: "Shortlisted",
    count: 12,
    candidates: [
      {
        name: "Alex Rivera",
        role: "Fullstack Engineer",
        skills: ["AWS Certified", "React", "Go"],
        level: 5,
        levelColor: "bg-success",
      },
      {
        name: "Jordan Chen",
        role: "Backend Specialist",
        skills: ["SkillForge Expert", "Python"],
        level: 6,
        levelColor: "bg-warning",
      },
    ],
  },
  {
    title: "Contacted",
    count: 8,
    candidates: [
      {
        name: "Sarah Jenkins",
        role: "DevOps Engineer",
        skills: ["Kubernetes", "Terraform"],
        level: 5,
        status: "Awaiting response (2d)",
        levelColor: "bg-warning",
      },
    ],
  },
  {
    title: "Interviewing",
    count: 5,
    candidates: [
      {
        name: "Marcus Thorne",
        role: "Lead Security Eng.",
        skills: ["Rust", "C++"],
        level: 7,
        upcomingRound: "Today, 2:30 PM (Technical)",
        levelColor: "bg-accent",
      },
    ],
  },
];

// ─── COMPONENT ──────────────────────────────────────────────────
export function PipelineContent() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Engineering Pipeline
          </h1>
          <p className="text-muted-foreground">
            Manage your high-performance technical candidates
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-secondary">
            <Users className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">TOTAL CANDIDATES</p>
            <p className="text-2xl font-bold text-foreground">1,248</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-warning/20">
            <Zap className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">RESPONSE RATE</p>
            <p className="text-2xl font-bold text-foreground">94.2%</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-accent/20">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">AVG. TIME TO HIRE</p>
            <p className="text-2xl font-bold text-foreground">18 Days</p>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {pipelineColumns.map((column) => (
          <div key={column.title} className="w-80 shrink-0">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">
                  {column.title}
                </h3>
                <span className="px-2 py-0.5 text-xs bg-secondary rounded-full text-muted-foreground">
                  {column.count}
                </span>
              </div>
              <button className="p-1 hover:bg-secondary rounded">
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Candidate Cards */}
            <div className="space-y-3">
              {column.candidates.map((candidate, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-lg p-4">
                  {/* Candidate Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-foreground font-semibold">
                      {candidate.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">
                        {candidate.name}
                      </h4>
                      <p className="text-sm text-primary">{candidate.role}</p>
                    </div>
                  </div>

                  {/* Status (optionnel) */}
                  {candidate.status && (
                    <div className="flex items-center gap-2 text-xs text-warning mb-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                      {candidate.status}
                    </div>
                  )}

                  {/* Upcoming Round (optionnel) */}
                  {candidate.upcomingRound && (
                    <div className="bg-secondary/50 rounded-lg p-2 mb-3">
                      <div className="text-xs text-muted-foreground mb-1">
                        UPCOMING ROUND
                      </div>
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {candidate.upcomingRound}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {candidate.skills.map((skill) => (
                      <SkillBadge
                        key={skill}
                        label={skill}
                        variant={
                          skill.includes("Expert") ||
                          skill.includes("Certified")
                            ? "primary"
                            : "outline"
                        }
                      />
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-1 text-xs rounded ${candidate.levelColor} text-background font-medium`}>
                      L{candidate.level}
                    </span>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-secondary rounded">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-1.5 hover:bg-secondary rounded">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-1.5 hover:bg-secondary rounded">
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>

                  {/* Join Call Button (si upcomingRound) */}
                  {candidate.upcomingRound && (
                    <button className="mt-3 w-full px-3 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 transition-colors">
                      Join Call
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
