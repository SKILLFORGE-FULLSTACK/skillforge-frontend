"use client";

import { useT } from "@/lib/i18n/useTranslation";

const technologies = [
  "Next.js 15",
  "Laravel 13",
  "Kafka",
  "RabbitMQ",
  "Redis",
  "Docker",
  "PostgreSQL",
];

export function TechStack() {
  const { t } = useT();

  return (
    <section className="py-12 border-y border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-8">
          {t("landing.techStack.label")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors cursor-default">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
