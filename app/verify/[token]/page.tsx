"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BadgeCheck, XCircle, Download, Loader2 } from "lucide-react";
import { Logo } from "@/components/skillforge/logo";
import { Button } from "@/components/ui/button";
import { certificationsApi } from "@/lib/api/certifications";
import { useT } from "@/lib/i18n/useTranslation";

export default function VerifyBadgePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const { t, tDate } = useT();

  const { data, isLoading, error } = useQuery({
    queryKey: ["verify-badge", token],
    queryFn: () => certificationsApi.verifyBadge(token),
    retry: false,
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-4 px-8 py-4 border-b border-border/30">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          {t("verify.back")}
        </Link>
        <div className="h-4 w-px bg-border/50" />
        <Logo />
      </header>

      <main className="max-w-lg mx-auto px-6 py-16">
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {(error || (data && !data.valid)) && (
          <div className="text-center py-8">
            <XCircle className="w-14 h-14 text-destructive mx-auto mb-4" />
            <h1 className="text-xl font-bold text-foreground mb-2">{t("verify.invalidTitle")}</h1>
            <p className="text-sm text-muted-foreground">{t("verify.invalidDesc")}</p>
          </div>
        )}

        {data && data.valid && (
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <BadgeCheck className="w-14 h-14 text-primary mx-auto mb-4" />
            <p className="text-xs uppercase tracking-wider text-primary mb-1">
              {t("verify.validTitle")}
            </p>
            <h1 className="text-2xl font-bold text-foreground mb-1">{data.badge.title}</h1>
            <p className="text-sm text-muted-foreground mb-6">
              {t("verify.issuedTo")} <strong className="text-foreground">{data.badge.developer.name}</strong>
            </p>

            <div className="grid grid-cols-2 gap-4 text-left border-t border-border pt-6 mb-6">
              {data.badge.score != null && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("verify.score")}</p>
                  <p className="text-lg font-semibold text-foreground">{data.badge.score}/100</p>
                </div>
              )}
              {data.badge.issued_at && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("verify.issuedOn")}</p>
                  <p className="text-lg font-semibold text-foreground">{tDate(data.badge.issued_at)}</p>
                </div>
              )}
            </div>

            {data.badge.certificate_url && (
              <a href={data.badge.certificate_url} target="_blank" rel="noopener noreferrer">
                <Button className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  {t("verify.downloadPdf")}
                </Button>
              </a>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
