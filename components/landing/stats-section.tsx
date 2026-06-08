"use client";

import { useT } from "@/lib/i18n/useTranslation";

export function StatsSection() {
  const { t } = useT();

  const stats = [
    { value: "94%", key: "landing.stats.successRate" },
    { value: "12k+", key: "landing.stats.mockInterviews" },
    { value: "450", key: "landing.stats.partnerCompanies" },
    { value: "3.5m", key: "landing.stats.commitsAnalyzed" },
  ];

  return (
    <section className="py-16 bg-card/50 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.key} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {t(stat.key)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
