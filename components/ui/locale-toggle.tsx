"use client";

import { useT } from "@/lib/i18n/useTranslation";

export function LocaleToggle() {
  const { locale, setLocale } = useT();

  return (
    <div className="relative flex items-center p-1 rounded-lg bg-secondary text-xs select-none">
      {/* sliding pill */}
      <div
        className={`absolute top-1 bottom-1 rounded bg-card shadow-sm transition-all duration-200 ease-in-out ${
          locale === "en"
            ? "left-[calc(50%+1px)] right-1"
            : "left-1 right-[calc(50%+1px)]"
        }`}
      />
      <button
        onClick={() => setLocale("fr")}
        className={`relative z-10 px-2.5 py-0.5 rounded cursor-pointer transition-colors duration-150 ${
          locale === "fr"
            ? "text-foreground font-semibold"
            : "text-muted-foreground hover:text-foreground"
        }`}>
        FR
      </button>
      <button
        onClick={() => setLocale("en")}
        className={`relative z-10 px-2.5 py-0.5 rounded cursor-pointer transition-colors duration-150 ${
          locale === "en"
            ? "text-foreground font-semibold"
            : "text-muted-foreground hover:text-foreground"
        }`}>
        EN
      </button>
    </div>
  );
}
