"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageLoader } from "@/components/ui/page-loader";
import {
  Search,
  Briefcase,
  MapPin,
  Wallet,
  Building2,
  AlertCircle,
} from "lucide-react";
import { useJobs } from "@/lib/hooks/useMarketplace";
import { useT } from "@/lib/i18n/useTranslation";

const CONTRACT_LABEL_KEYS: Record<string, string> = {
  full_time: "recruiter.fullTime",
  part_time: "recruiter.partTime",
  freelance: "recruiter.freelance",
};

const WORK_MODE_LABEL_KEYS: Record<string, string> = {
  remote: "recruiter.remote",
  hybrid: "recruiter.hybrid",
  onsite: "recruiter.onsite",
};

export function JobsListContent() {
  const { t } = useT();
  const [search, setSearch] = useState("");
  const [contractType, setContractType] = useState<string>("");
  const [workMode, setWorkMode] = useState<string>("");

  const { data: jobs, isLoading, error } = useJobs({
    search: search || undefined,
    contract_type: contractType || undefined,
    work_mode: workMode || undefined,
    per_page: 20,
  });

  const filters: Array<{ label: string; value: string; onClick: () => void; active: boolean }> = [
    { label: t("jobs.allContracts"), value: "", onClick: () => setContractType(""), active: contractType === "" },
    ...Object.entries(CONTRACT_LABEL_KEYS).map(([value, key]) => ({
      label: t(key),
      value,
      onClick: () => setContractType(value),
      active: contractType === value,
    })),
  ];

  const modeFilters: Array<{ label: string; value: string; onClick: () => void; active: boolean }> = [
    { label: t("jobs.allModes"), value: "", onClick: () => setWorkMode(""), active: workMode === "" },
    ...Object.entries(WORK_MODE_LABEL_KEYS).map(([value, key]) => ({
      label: t(key),
      value,
      onClick: () => setWorkMode(value),
      active: workMode === value,
    })),
  ];

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t("jobs.title")}</h1>
        <p className="text-muted-foreground">{t("jobs.subtitle")}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("jobs.searchPlaceholder")}
            className="pl-10 bg-muted border-border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        {filters.map((f) => (
          <Button
            key={f.label}
            variant={f.active ? "default" : "outline"}
            size="sm"
            onClick={f.onClick}
            className={f.active ? "bg-primary cursor-pointer" : "cursor-pointer hover:bg-primary/10 hover:text-primary"}>
            {f.label}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {modeFilters.map((f) => (
          <Button
            key={f.label}
            variant={f.active ? "default" : "outline"}
            size="sm"
            onClick={f.onClick}
            className={f.active ? "bg-accent cursor-pointer" : "cursor-pointer hover:bg-accent/10 hover:text-accent"}>
            {f.label}
          </Button>
        ))}
      </div>

      {isLoading && <PageLoader />}

      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          <AlertCircle className="w-5 h-5" />
          <span>{t("jobs.errorLoad")}</span>
        </div>
      )}

      {!isLoading && !error && (
        <div className="space-y-4">
          {jobs?.data.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">{t("jobs.noResults")}</p>
            </div>
          ) : (
            jobs?.data.map((job) => (
              <Link key={job.id} href={`/dashboard/jobs/${job.id}`}>
                <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                          <Building2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{job.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {job.recruiter?.company_name ?? t("jobs.confidentialCompany")}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {job.location ?? t("jobs.locationNotSpecified")}
                            </span>
                            {(job.salary_min || job.salary_max) && (
                              <span className="flex items-center gap-1">
                                <Wallet className="w-3.5 h-3.5" />
                                {job.salary_min && job.salary_max
                                  ? `${job.salary_min.toLocaleString()}–${job.salary_max.toLocaleString()} ${job.currency}`
                                  : `${(job.salary_min ?? job.salary_max)?.toLocaleString()} ${job.currency}`}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Badge variant="outline" className="text-xs">
                          {t(CONTRACT_LABEL_KEYS[job.contract_type] ?? "recruiter.fullTime")}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {t(WORK_MODE_LABEL_KEYS[job.work_mode] ?? "recruiter.remote")}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
