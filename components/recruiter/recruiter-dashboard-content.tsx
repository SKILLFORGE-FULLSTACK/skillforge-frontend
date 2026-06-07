"use client";

import { StatCard } from "@/components/skillforge";
import { Users, MessageSquare, Briefcase, Plus, Eye, MoreVertical, Loader2, AlertCircle } from "lucide-react";
import { useJobs, useCreateJob } from "@/lib/hooks/useMarketplace";
import { useAuthStore } from "@/lib/stores/authStore";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function RecruiterDashboardContent() {
  const user = useAuthStore((s) => s.user);
  const { data: jobsData, isLoading: jobsLoading } = useJobs({ per_page: 5 });
  const { mutate: createJob, isPending: isCreating } = useCreateJob();
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    contract_type: "full_time",
    work_mode: "remote",
    location: "",
    salary_min: "",
    salary_max: "",
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.description) return;
    createJob(
      {
        title: jobForm.title,
        description: jobForm.description,
        contract_type: jobForm.contract_type,
        work_mode: jobForm.work_mode,
        location: jobForm.location || undefined,
        salary_min: jobForm.salary_min ? Number(jobForm.salary_min) : undefined,
        salary_max: jobForm.salary_max ? Number(jobForm.salary_max) : undefined,
      },
      {
        onSuccess: () => {
          setShowJobForm(false);
          setJobForm({ title: "", description: "", contract_type: "full_time", work_mode: "remote", location: "", salary_min: "", salary_max: "" });
        },
      },
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {user?.name ?? "Recruiter"}
          </h1>
          <p className="text-muted-foreground">
            Gérez vos offres d'emploi et trouvez les meilleurs talents.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-3 py-2 bg-card border border-border rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">System Health</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-sm font-medium text-success">Stable</span>
            </div>
          </div>
          <div className="px-3 py-2 bg-card border border-border rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Plan</div>
            <span className="text-sm font-medium text-accent capitalize">{user?.plan ?? "free"}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard
          title="OFFRES ACTIVES"
          value={jobsData?.meta.total ?? 0}
          icon={Briefcase}
        />
        <StatCard
          title="DÉVELOPPEURS DISPONIBLES"
          value={user ? "—" : 0}
          icon={Users}
          subtitle="Recherchez dans la marketplace"
        />
        <StatCard
          title="MESSAGES"
          value={0}
          icon={MessageSquare}
        />
      </div>

      {/* Active Jobs */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Offres d'emploi actives</h2>
          <button
            onClick={() => setShowJobForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            Nouvelle offre
          </button>
        </div>

        {jobsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : jobsData?.data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Briefcase className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Aucune offre publiée. Créez votre première offre !</p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobsData?.data.map((job) => (
              <div key={job.id} className="p-4 border border-border rounded-lg flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground">{job.title}</h3>
                    <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded font-mono">
                      {job.contract_type}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-secondary text-muted-foreground rounded">
                      {job.work_mode}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {job.location ?? "Toutes locations"} •{" "}
                    {job.salary_min && job.salary_max
                      ? `${job.salary_min.toLocaleString()}–${job.salary_max.toLocaleString()} ${job.currency}`
                      : "Salaire non précisé"}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {job.views_count} vues
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Publié le {new Date(job.published_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <button className="p-1 hover:bg-secondary rounded">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Job Dialog */}
      <Dialog open={showJobForm} onOpenChange={setShowJobForm}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle>Créer une offre d'emploi</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateJob} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                Titre du poste *
              </label>
              <Input
                value={jobForm.title}
                onChange={(e) => setJobForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="ex: Senior Backend Engineer"
                required
                className="bg-secondary border-border"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                Description *
              </label>
              <textarea
                value={jobForm.description}
                onChange={(e) => setJobForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Décrivez le poste..."
                required
                rows={4}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                  Type de contrat
                </label>
                <select
                  value={jobForm.contract_type}
                  onChange={(e) => setJobForm((p) => ({ ...p, contract_type: e.target.value }))}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none">
                  <option value="full_time">Full-time</option>
                  <option value="part_time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                  Mode de travail
                </label>
                <select
                  value={jobForm.work_mode}
                  onChange={(e) => setJobForm((p) => ({ ...p, work_mode: e.target.value }))}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none">
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="on_site">On-site</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                Localisation
              </label>
              <Input
                value={jobForm.location}
                onChange={(e) => setJobForm((p) => ({ ...p, location: e.target.value }))}
                placeholder="ex: Paris, France"
                className="bg-secondary border-border"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                  Salaire min (€/an)
                </label>
                <Input
                  type="number"
                  value={jobForm.salary_min}
                  onChange={(e) => setJobForm((p) => ({ ...p, salary_min: e.target.value }))}
                  placeholder="50000"
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                  Salaire max (€/an)
                </label>
                <Input
                  type="number"
                  value={jobForm.salary_max}
                  onChange={(e) => setJobForm((p) => ({ ...p, salary_max: e.target.value }))}
                  placeholder="80000"
                  className="bg-secondary border-border"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowJobForm(false)}
                className="flex-1">
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
                className="flex-1 bg-primary hover:bg-primary/90">
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publier l'offre"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
