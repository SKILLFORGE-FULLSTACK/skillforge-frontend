"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { type MouseEvent, useEffect, useState } from "react"
import { Logo } from "@/components/skillforge"
import { useT } from "@/lib/i18n/useTranslation"
import { useAuthStore } from "@/lib/stores/authStore"
import { LocaleToggle } from "@/components/ui/locale-toggle"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<"home" | "solutions" | "enterprise">("home")
  const { t, locale, setLocale } = useT()
  const { isAuthenticated, user } = useAuthStore()
  const dashboardHref = user?.role === "recruiter" ? "/recruiter" : "/dashboard"

  useEffect(() => {
    const updateActiveSection = () => {
      const solutions = document.getElementById("solutions")
      const enterprise = document.getElementById("enterprise")

      if (enterprise && enterprise.getBoundingClientRect().top <= 112) {
        setActiveSection("enterprise")
        return
      }

      if (solutions && solutions.getBoundingClientRect().top <= 112) {
        setActiveSection("solutions")
        return
      }

      setActiveSection("home")
    }

    updateActiveSection()
    window.addEventListener("scroll", updateActiveSection, { passive: true })
    window.addEventListener("resize", updateActiveSection)

    return () => {
      window.removeEventListener("scroll", updateActiveSection)
      window.removeEventListener("resize", updateActiveSection)
    }
  }, [])

  const navigationClass = (section: "solutions" | "enterprise") =>
    `relative z-10 w-20 py-5 text-center text-sm font-medium transition-colors ${
      activeSection === section ? "text-foreground" : "text-muted-foreground hover:text-foreground"
    }`

  const scrollToSection = (section: "solutions" | "enterprise") => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const target = document.getElementById(section)

    if (!target) return

    setActiveSection(section)
    window.history.replaceState(null, "", `#${section}`)
    target.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const scrollToTop = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    setActiveSection("home")
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Logo href="/" onClick={scrollToTop} />
            <div className="relative hidden items-center gap-6 md:flex">
              <Link
                href="#solutions"
                className={navigationClass("solutions")}
                aria-current={activeSection === "solutions" ? "page" : undefined}
                onClick={scrollToSection("solutions")}
              >
                {t("nav.solutions")}
              </Link>
              <Link
                href="#enterprise"
                className={navigationClass("enterprise")}
                aria-current={activeSection === "enterprise" ? "page" : undefined}
                onClick={scrollToSection("enterprise")}
              >
                {t("nav.enterprise")}
              </Link>
              <span
                aria-hidden="true"
                className={`absolute bottom-3 left-0 h-0.5 w-20 rounded-full bg-primary transition-[transform,opacity] duration-500 ease-out ${
                  activeSection === "home"
                    ? "-translate-y-1 opacity-0"
                    : activeSection === "solutions"
                      ? "translate-x-0 opacity-100"
                      : "translate-x-[6.5rem] opacity-100"
                }`}
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <LocaleToggle />
            <ThemeToggle />
            {isAuthenticated ? (
              <Link href={dashboardHref} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                {t("nav.dashboard")}
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {t("nav.signIn")}
                </Link>
                <Link href="/register" className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  {t("nav.getStarted")}
                </Link>
              </>
            )}
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
              <Link href="#solutions" onClick={(event) => { setMobileMenuOpen(false); scrollToSection("solutions")(event) }} className="text-sm font-medium text-foreground">{t("nav.solutions")}</Link>
              <Link href="#enterprise" onClick={(event) => { setMobileMenuOpen(false); scrollToSection("enterprise")(event) }} className="text-sm font-medium text-muted-foreground">{t("nav.enterprise")}</Link>
              <hr className="border-border" />
              <LocaleToggle />
              {isAuthenticated ? (
                <Link href={dashboardHref} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg text-center">
                  {t("nav.dashboard")}
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium text-muted-foreground">{t("nav.signIn")}</Link>
                  <Link href="/register" className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg text-center">
                    {t("nav.getStarted")}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
