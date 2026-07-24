"use client";

import Link from "next/link";
import { Logo } from "@/components/skillforge";
import { useT } from "@/lib/i18n/useTranslation";
import { useAuthStore } from "@/lib/stores/authStore";

export function LandingFooter() {
  const { t } = useT();
  const { isAuthenticated, user } = useAuthStore();

  const certsHref = isAuthenticated ? "/dashboard/certifications" : "/register";
  const marketplaceHref = !isAuthenticated
    ? "/register?role=recruiter"
    : user?.role === "recruiter"
      ? "/recruiter/marketplace"
      : "/dashboard";

  const productLinks = [
    { label: t("landing.footer.links.interviews"), href: "#solutions" },
    { label: t("landing.footer.links.certifications"), href: certsHref },
    { label: t("landing.footer.links.marketplace"), href: marketplaceHref },
  ];

  const communityLinks = [
    { label: t("landing.footer.links.forum"), href: "/dashboard/forum" },
  ];

  const legalLinks = [
    { label: t("landing.footer.links.privacy"), href: "/privacy" },
    { label: t("landing.footer.links.terms"), href: "/terms" },
  ];

  return (
    <footer className="bg-card border-t border-border py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div>
            <Logo href="/" className="mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              {t("landing.footer.description")}
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">
              {t("landing.footer.product")}
            </h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">
              {t("landing.footer.community")}
            </h4>
            <ul className="space-y-3">
              {communityLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">
              {t("landing.footer.legal")}
            </h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <p className="text-sm text-center text-muted-foreground">
            {t("landing.footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
