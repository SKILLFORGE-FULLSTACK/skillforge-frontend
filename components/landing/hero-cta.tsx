"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/stores/authStore";
import { useT } from "@/lib/i18n/useTranslation";

export function HeroCTA() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { t } = useT();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
      <Link
        href={isAuthenticated ? "/dashboard" : "/login"}
        className="w-full sm:w-auto px-8 py-3 text-base font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
        {t("landing.hero.ctaStart")}
      </Link>
      <Link
        href="/certifications"
        className="w-full sm:w-auto px-8 py-3 text-base font-medium border border-border text-foreground rounded-lg hover:bg-secondary transition-colors">
        {t("landing.hero.ctaCerts")}
      </Link>
    </div>
  );
}
