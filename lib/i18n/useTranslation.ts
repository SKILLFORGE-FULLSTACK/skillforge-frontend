"use client";

import { useLocaleStore } from "@/lib/stores/localeStore";
import { translations } from "./translations";

export function useT() {
  const { locale, setLocale } = useLocaleStore();

  function t(key: string): string {
    const keys = key.split(".");
    let value: unknown = translations[locale];
    for (const k of keys) {
      if (value == null || typeof value !== "object") break;
      value = (value as Record<string, unknown>)[k];
    }
    if (typeof value === "string") return value;

    // fallback to fr
    let fallback: unknown = translations.fr;
    for (const k of keys) {
      if (fallback == null || typeof fallback !== "object") break;
      fallback = (fallback as Record<string, unknown>)[k];
    }
    return typeof fallback === "string" ? fallback : key;
  }

  function tDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString(
      locale === "fr" ? "fr-FR" : "en-US"
    );
  }

  return { t, tDate, locale, setLocale };
}
