import Link from "next/link";
import { Logo } from "@/components/skillforge";
import { Github, Linkedin } from "lucide-react";

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
  return (
    <footer className="bg-card border-t border-border py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div>
            <Logo href="/" className="mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Engineering-grade evaluation and career acceleration for the
              modern developer.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">
              Community
            </h4>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <p className="text-sm text-center text-muted-foreground">
            © 2026 SkillForge. Designed for world-class engineering teams.
          </p>
        </div>
      </div>
    </footer>
  );
}
