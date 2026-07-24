"use client";

import { useT } from "@/lib/i18n/useTranslation";

export function StatsSection() {
  const { t } = useT();

  // Des faits vérifiables sur le produit, pas des chiffres d'usage inventés
  // (plateforme en phase de lancement — pas de social proof à afficher).
  const facts = [
    "landing.why.real",
    "landing.why.voice",
    "landing.why.always",
    "landing.why.bilingual",
  ] as const;

  return (
    <section className="py-16 bg-card/50 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {facts.map((key) => (
            <div key={key} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-foreground mb-1">
                {t(`${key}.value`)}
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {t(`${key}.label`)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
