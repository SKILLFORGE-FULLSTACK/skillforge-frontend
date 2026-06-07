"use client";

import { Link as LinkIcon, Globe, Play, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSubmitWork } from "@/lib/hooks/useCertifications";

interface VerifiableCredentialProps {
  title: string;
  id: string;
  issuer: string;
  network: string;
}

export function VerifiableCredential({ title, id, issuer, network }: VerifiableCredentialProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-xs uppercase tracking-wider text-accent text-center mb-4">
        VERIFIABLE CREDENTIAL
      </h3>

      {/* QR Code Placeholder */}
      <div className="w-32 h-32 mx-auto mb-4 bg-secondary rounded-lg p-2">
        <div className="w-full h-full bg-background rounded grid grid-cols-5 gap-0.5 p-2">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className={`${i % 3 === 0 || i % 7 === 0 ? "bg-foreground" : "bg-transparent"}`}
            />
          ))}
        </div>
      </div>

      <h4 className="text-center font-semibold text-foreground mb-1">{title}</h4>
      <p className="text-center text-xs text-muted-foreground font-mono mb-4">ID: {id}</p>

      <div className="flex items-center justify-center gap-8 text-xs text-muted-foreground">
        <div>
          <span className="block text-muted-foreground/60 mb-0.5">ISSUED BY</span>
          <span className="text-foreground">{issuer}</span>
        </div>
        <div>
          <span className="block text-muted-foreground/60 mb-0.5">NETWORK</span>
          <span className="text-foreground">{network}</span>
        </div>
      </div>
    </div>
  );
}

interface SubmissionFormProps {
  submissionId?: string;
  disabled?: boolean;
}

export function SubmissionForm({ submissionId, disabled }: SubmissionFormProps) {
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [notes, setNotes] = useState("");
  const { mutate: submitWork, isPending } = useSubmitWork();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionId || !githubUrl) return;
    submitWork({
      submissionId,
      payload: {
        github_url: githubUrl,
        live_url: liveUrl || undefined,
        notes: notes || undefined,
      },
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-secondary rounded-lg">
          <LinkIcon className="w-5 h-5 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Submission</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
            GITHUB REPOSITORY URL *
          </label>
          <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border border-border rounded-lg focus-within:border-primary/50">
            <LinkIcon className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="url"
              placeholder="https://github.com/user/repo"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              required
              disabled={disabled || isPending}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
            LIVE URL (OPTIONAL)
          </label>
          <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border border-border rounded-lg focus-within:border-primary/50">
            <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="url"
              placeholder="https://your-demo.com"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              disabled={disabled || isPending}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
            NOTES
          </label>
          <textarea
            placeholder="Décrivez les choix techniques..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            disabled={disabled || isPending}
            className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 disabled:opacity-50 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={disabled || isPending || !submissionId || !githubUrl}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {isPending ? "Soumission en cours..." : "Submit Certification"}
        </button>

        {!submissionId && (
          <p className="text-xs text-center text-warning">
            Démarrez la certification pour pouvoir soumettre.
          </p>
        )}

        <p className="text-xs text-center text-muted-foreground">
          Notre suite automatisée et nos experts traiteront votre soumission sous 48h ouvrables.
        </p>
      </form>
    </div>
  );
}
