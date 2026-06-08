"use client";

import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/lib/stores/themeStore";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
      className={`p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer ${className ?? ""}`}>
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-muted-foreground" />
      ) : (
        <Moon className="w-4 h-4 text-muted-foreground" />
      )}
    </button>
  );
}
