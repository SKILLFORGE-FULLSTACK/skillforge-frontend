"use client";

import { use } from "react";
import { DashboardHeader } from "@/components/dashboard";
import {
  CertificationHeader,
  ProjectBrief,
  EvaluationCriteria,
  VerifiableCredential,
  SubmissionForm,
} from "@/components/certifications";
import { useCertification, useMySubmissions, useStartCertification } from "@/lib/hooks/useCertifications";
import { AlertCircle, Loader2 } from "lucide-react";
import { PageLoader } from "@/components/ui/page-loader";
import { Button } from "@/components/ui/button";

export default function CertificationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = use(params);
  const { data: cert, isLoading, error } = useCertification(slug);
  const { data: submissions } = useMySubmissions();
  const { mutate: startCert, isPending: isStarting } = useStartCertification();

  const submission = submissions?.find((s) => s.certification.slug === slug);

  if (isLoading) {
    return (
      <>
        <DashboardHeader />
        <main className="flex-1 overflow-auto">
          <PageLoader fullScreen />
        </main>
      </>
    );
  }

  if (error || !cert) {
    return (
      <>
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
            <AlertCircle className="w-5 h-5" />
            <span>Certification introuvable.</span>
          </div>
        </main>
      </>
    );
  }

  const isPassed = submission?.status === "passed";
  const hasActiveSubmission = !!submission;

  return (
    <>
      <DashboardHeader />
      <main className="flex-1 overflow-auto p-6">
        <CertificationHeader
          level={cert.estimated_hours}
          title={cert.title}
          category={cert.category}
          passScore={cert.pass_score}
          daysRemaining={submission?.days_remaining ?? 30}
        />

        {/* Start button if no submission yet */}
        {!hasActiveSubmission && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Prêt à commencer ?</p>
              <p className="text-sm text-muted-foreground">
                Vous avez 30 jours pour soumettre votre projet.
              </p>
            </div>
            <Button
              onClick={() => startCert(slug)}
              disabled={isStarting}
              className="bg-primary hover:bg-primary/90">
              {isStarting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Démarrer la certification
            </Button>
          </div>
        )}

        {isPassed && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <p className="font-medium text-green-500">
              Certification réussie avec un score de {submission?.score}/100 !
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <ProjectBrief
              description={<span>{cert.description}</span>}
              requirements={
                cert.requirements ?? [
                  {
                    title: "OBJECTIF PRINCIPAL",
                    description: cert.description,
                  },
                ]
              }
            />

            <EvaluationCriteria
              criteria={
                (Array.isArray(cert.evaluation_criteria) ? cert.evaluation_criteria : []).map((c) => ({
                  name: c.name,
                  weight: c.weight,
                  variant: "primary" as const,
                }))
              }
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {isPassed && submission?.badge && (
              <VerifiableCredential badge={submission.badge} />
            )}
            <SubmissionForm
              submissionId={submission?.id}
              disabled={isPassed || !hasActiveSubmission}
            />
          </div>
        </div>
      </main>
    </>
  );
}
