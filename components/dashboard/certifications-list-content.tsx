"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Filter, Clock, CheckCircle2, Award, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { useCertifications, useMySubmissions, useStartCertification } from "@/lib/hooks/useCertifications";

export function CertificationsListContent() {
  const [search, setSearch] = useState("");
  const { data: certifications, isLoading, error } = useCertifications();
  const { data: submissions } = useMySubmissions();
  const { mutate: startCert, isPending: isStarting } = useStartCertification();

  const submissionMap = new Map(
    submissions?.map((s) => [s.certification.slug, s]) ?? [],
  );

  const filtered = certifications?.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase()),
  ) ?? [];

  const completed = submissions?.filter((s) => s.status === "passed").length ?? 0;
  const inProgress = submissions?.filter((s) => s.status === "pending" || s.status === "in_review").length ?? 0;
  const avgScore =
    submissions && submissions.length > 0
      ? Math.round(
          submissions.filter((s) => s.score != null).reduce((acc, s) => acc + (s.score ?? 0), 0) /
            (submissions.filter((s) => s.score != null).length || 1),
        )
      : 0;

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Certifications</h1>
          <p className="text-muted-foreground">Validez vos compétences avec des projets réels</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une certification..."
            className="pl-10 bg-muted border-border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filtres
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{completed}</p>
              <p className="text-sm text-muted-foreground">Complétées</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{inProgress}</p>
              <p className="text-sm text-muted-foreground">En cours</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <Award className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{avgScore}</p>
              <p className="text-sm text-muted-foreground">Score moyen</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          <AlertCircle className="w-5 h-5" />
          <span>Erreur lors du chargement des certifications.</span>
        </div>
      )}

      {/* Certifications Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((cert) => {
            const sub = submissionMap.get(cert.slug);
            const isPassed = sub?.status === "passed";
            const isInProgress = sub?.status === "pending" || sub?.status === "in_review";

            return (
              <Card
                key={cert.id}
                className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{cert.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{cert.description}</p>
                    </div>
                    {isPassed && (
                      <div className="flex items-center gap-1 text-green-500">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-medium">{sub?.score}/100</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {cert.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <Badge
                      variant="outline"
                      className={
                        cert.level === "expert"
                          ? "border-accent text-accent"
                          : cert.level === "advanced"
                          ? "border-primary text-primary"
                          : "border-muted-foreground"
                      }>
                      {cert.level}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {cert.estimated_hours}h
                    </span>
                  </div>

                  {isInProgress && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">En attente d'évaluation</span>
                      </div>
                      <Progress value={50} className="h-2" />
                    </div>
                  )}

                  {isPassed ? (
                    <Link href={`/dashboard/certifications/${cert.slug}`}>
                      <Button className="w-full" variant="outline">
                        Voir le certificat <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  ) : isInProgress ? (
                    <Link href={`/dashboard/certifications/${cert.slug}`}>
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        Continuer <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={isStarting}
                      onClick={() => startCert(cert.slug)}>
                      {isStarting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <ArrowRight className="w-4 h-4 ml-2" />
                      )}
                      Commencer
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {filtered.length === 0 && !isLoading && (
            <div className="col-span-2 text-center py-12 text-muted-foreground">
              <p>Aucune certification trouvée.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
