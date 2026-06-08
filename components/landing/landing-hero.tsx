"use client"

import { HeroCTA } from "./hero-cta"
import { useT } from "@/lib/i18n/useTranslation"

export function LandingHero() {
  const { t } = useT()

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">{t("landing.hero.badge")}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            {t("landing.hero.title")}
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            {t("landing.hero.subtitle")}
          </p>

          <HeroCTA />

          <div className="relative rounded-xl overflow-hidden border border-border shadow-2xl shadow-primary/5">
            <div className="aspect-video bg-card">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function DashboardPreview() {
  return (
    <div className="w-full h-full bg-[#0d1117] p-4 lg:p-8">
      <div className="flex h-full">
        <div className="hidden lg:block w-48 bg-[#161b22] rounded-lg p-4 mr-4">
          <div className="space-y-3">
            <div className="h-3 w-20 bg-primary/30 rounded" />
            <div className="space-y-2 pt-4">
              <div className="h-8 bg-primary/20 rounded flex items-center px-2">
                <div className="w-4 h-4 bg-primary rounded mr-2" />
                <div className="h-2 w-16 bg-primary/40 rounded" />
              </div>
              <div className="h-8 bg-transparent rounded flex items-center px-2">
                <div className="w-4 h-4 bg-muted rounded mr-2" />
                <div className="h-2 w-20 bg-muted/40 rounded" />
              </div>
              <div className="h-8 bg-transparent rounded flex items-center px-2">
                <div className="w-4 h-4 bg-muted rounded mr-2" />
                <div className="h-2 w-14 bg-muted/40 rounded" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 bg-[#161b22] rounded-lg p-4 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-primary flex items-center justify-center">
                <span className="text-2xl font-bold text-foreground">850</span>
              </div>
            </div>
            <div className="flex-1 bg-[#161b22] rounded-lg p-4">
              <div className="h-3 w-20 bg-accent/30 rounded mb-2" />
              <div className="h-4 w-32 bg-foreground/20 rounded mb-4" />
              <div className="h-2 w-full bg-primary/30 rounded-full">
                <div className="h-2 w-2/3 bg-primary rounded-full" />
              </div>
            </div>
          </div>
          <div className="bg-[#161b22] rounded-lg p-4 h-32">
            <div className="h-3 w-32 bg-foreground/20 rounded mb-4" />
            <div className="grid grid-cols-26 gap-0.5">
              {Array.from({ length: 130 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-sm"
                  style={{
                    backgroundColor:
                      i % 3 === 0
                        ? `rgba(99, 102, 241, ${0.3 + (i % 5) * 0.15})`
                        : "rgba(55, 65, 81, 0.3)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
