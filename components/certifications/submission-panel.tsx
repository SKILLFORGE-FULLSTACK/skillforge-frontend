"use client";

import { Link as LinkIcon, Globe, Play, Loader2, Download, ShieldCheck, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useSubmitWork } from "@/lib/hooks/useCertifications";
import { UserBadge } from "@/lib/api/certifications";
import { useT } from "@/lib/i18n/useTranslation";

interface VerifiableCredentialProps {
  badge: UserBadge;
}

export function VerifiableCredential({ badge }: VerifiableCredentialProps) {
  const { t } = useT();

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-center gap-2 mb-4">
        <ShieldCheck className="w-4 h-4 text-accent" />
        <h3 className="text-xs uppercase tracking-wider text-accent">
          {t("certifications.credentialTitle")}
        </h3>
      </div>

      <h4 className="text-center font-semibold text-foreground mb-1">{badge.title}</h4>
      <p className="text-center text-xs text-muted-foreground font-mono mb-4">
        {badge.score != null ? `${badge.score}/100` : null} · {badge.issued_at}
      </p>

      <div className="space-y-2">
        {badge.certificate_url && (
          <a
            href={badge.certificate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <Download className="w-4 h-4" />
            {t("certifications.downloadCertificate")}
          </a>
        )}
        <a
          href={badge.verify_url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
          <ExternalLink className="w-4 h-4" />
          {t("certifications.verifyCredential")}
        </a>
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
