"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { Logo } from "@/components/skillforge"
import { useT } from "@/lib/i18n/useTranslation"
import { LocaleToggle } from "@/components/ui/locale-toggle"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t, locale, setLocale } = useT()

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Logo href="/" />
            <div className="hidden md:flex items-center gap-6">
              <Link href="#solutions" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                {t("nav.solutions")}
              </Link>
              <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {t("nav.pricing")}
              </Link>
              <Link href="#enterprise" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {t("nav.enterprise")}
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <LocaleToggle />
            <ThemeToggle />
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t("nav.signIn")}
            </Link>
            <Link href="/dashboard" className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              {t("nav.demo")}
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link href="#solutions" className="text-sm font-medium text-foreground">{t("nav.solutions")}</Link>
              <Link href="#pricing" className="text-sm font-medium text-muted-foreground">{t("nav.pricing")}</Link>
              <Link href="#enterprise" className="text-sm font-medium text-muted-foreground">{t("nav.enterprise")}</Link>
              <hr className="border-border" />
              <LocaleToggle />
              <Link href="/login" className="text-sm font-medium text-muted-foreground">{t("nav.signIn")}</Link>
              <Link href="/dashboard" className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg text-center">
                {t("nav.demo")}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
