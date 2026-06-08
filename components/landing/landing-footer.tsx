"use client";

import Link from "next/link";
import { Logo } from "@/components/skillforge";
import { Github, Linkedin } from "lucide-react";
import { useT } from "@/lib/i18n/useTranslation";

const footerLinks = {
  product: [
    { label: "Roadmap", href: "#" },
    { label: "Certifications", href: "/certifications" },
    { label: "Enterprise", href: "#" },
  ],
  community: [
    { label: "Open Source", href: "#" },
    { label: "Events", href: "#" },
    { label: "Blog", href: "#" },
  ],
  support: [
    { label: "Help Center", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
};

export function LandingFooter() {
  const { t } = useT();

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
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">
              {t("landing.footer.product")}
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
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
              {footerLinks.community.map((link) => (
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
              {t("landing.footer.support")}
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
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
