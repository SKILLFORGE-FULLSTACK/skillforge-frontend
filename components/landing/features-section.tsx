"use client";

import { Code2, Award, CheckCircle } from "lucide-react"
import { useT } from "@/lib/i18n/useTranslation"

export function FeaturesSection() {
  const { t } = useT()

  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-12">
          {t("landing.features.title")}
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Mock Interviews AI Card */}
          <div className="bg-card border border-border rounded-xl p-6 lg:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {t("landing.features.interviews.title")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("landing.features.interviews.description")}
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>{t("landing.features.interviews.feature1")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>{t("landing.features.interviews.feature2")}</span>
              </div>
            </div>

            <div className="aspect-video bg-secondary/50 rounded-lg overflow-hidden">
              <InterviewPreview />
            </div>
          </div>

          {/* Certification Card */}
          <div className="bg-card border border-border rounded-xl p-6 lg:p-8">
            <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 w-fit mb-4">
              <Award className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {t("landing.features.certification.title")}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {t("landing.features.certification.description")}
            </p>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-destructive/20 border-2 border-destructive" />
              <div className="w-8 h-8 rounded-full bg-warning/20 border-2 border-warning -ml-2" />
              <div className="w-8 h-8 rounded-full bg-success/20 border-2 border-success -ml-2" />
            </div>

            <p className="text-xs text-muted-foreground">
              {t("landing.features.certification.certified")}
            </p>
          </div>
        </div>

        {/* Marketplace Section */}
        <div className="mt-8 bg-card border border-border rounded-xl overflow-hidden">
          <div className="lg:flex">
            <div className="lg:w-1/2 aspect-video lg:aspect-auto bg-secondary/30">
              <MarketplacePreview />
            </div>
            <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 w-fit mb-4">
                <span className="text-xs font-medium text-accent">
                  {t("landing.features.marketplace.badge")}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {t("landing.features.marketplace.title")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("landing.features.marketplace.description")}
              </p>
              <button className="w-fit px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
                {t("landing.features.marketplace.cta")}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function InterviewPreview() {
  return (
    <div className="w-full h-full bg-[#0d1117] p-4 flex gap-4">
      <div className="w-1/2 bg-[#161b22] rounded-lg p-3">
        <div className="h-3 w-20 bg-primary/30 rounded mb-3" />
        <div className="space-y-1 font-mono text-[10px] text-muted-foreground/60">
          <div>function levelOrder(root) {"{"}</div>
          <div className="pl-4">if (!root) return [];</div>
          <div className="pl-4">const queue = [root];</div>
          <div className="pl-4">const result = [];</div>
          <div>{"}"}</div>
        </div>
      </div>
      <div className="w-1/2 flex flex-col gap-2">
        <div className="bg-[#161b22] rounded-lg p-3 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-accent/30" />
            <div className="h-2 w-20 bg-foreground/20 rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-2 w-full bg-foreground/10 rounded" />
            <div className="h-2 w-4/5 bg-foreground/10 rounded" />
          </div>
        </div>
        <div className="bg-primary/20 rounded-lg p-2 text-[10px] text-primary">
          {'"How would you optimize..."'}
        </div>
      </div>
    </div>
  )
}

function MarketplacePreview() {
  return (
    <div className="w-full h-full bg-[#0d1117] p-4 flex items-center justify-center">
      <div className="flex gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-20 h-28 bg-[#161b22] rounded-lg p-2 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary/30 to-accent/30 mb-2" />
            <div className="h-2 w-12 bg-foreground/20 rounded mb-1" />
            <div className="h-1.5 w-10 bg-muted/30 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
