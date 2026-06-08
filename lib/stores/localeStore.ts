import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "fr" | "en";

interface LocaleStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set) => ({
      locale: "fr",
      setLocale: (locale) => set({ locale }),
    }),
    { name: "skillforge_locale" }
  )
);
