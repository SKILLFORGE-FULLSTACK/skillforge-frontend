"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Moon,
  Shield,
  Terminal,
  Lock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/skillforge/logo";
import { useAuth } from "@/lib/hooks/useAuth";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [role, setRole] = useState<"developer" | "recruiter">("developer");
  const [companyName, setCompanyName] = useState("");

  // ─── HOOK AUTH ──────────────────────────────────────────────
  const { register, isRegistering } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) return;

    register({
      name: fullName,
      email,
      password,
      password_confirmation: password,
      role,
      ...(role === "recruiter" && { company_name: companyName }),
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-border/30">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/certifications"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Certification Tracks
          </Link>
          <Link
            href="/resources"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Resources
          </Link>
          <Link
            href="/about"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <span className="text-sm text-accent">FR/EN</span>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Moon className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground italic mb-4">
            Join the Elite 1%
          </h1>
          <p className="text-muted-foreground text-lg">
            The definitive benchmark for senior software
            <br />
            engineering mastery.
          </p>
        </div>

        <div className="w-full max-w-md p-8 bg-card/30 border border-border/50 rounded-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ─── SÉLECTION RÔLE ─── */}
            <div className="space-y-2">
              <label className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("developer")}
                  className={`h-12 rounded-lg border text-sm font-medium transition-all ${
                    role === "developer"
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border/50 bg-card text-muted-foreground hover:border-accent/50"
                  }`}>
                  Developer
                </button>
                <button
                  type="button"
                  onClick={() => setRole("recruiter")}
                  className={`h-12 rounded-lg border text-sm font-medium transition-all ${
                    role === "recruiter"
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border/50 bg-card text-muted-foreground hover:border-accent/50"
                  }`}>
                  Recruiter
                </button>
              </div>
            </div>

            {/* ─── NOM COMPLET ─── */}
            <div className="space-y-2">
              <label className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Full Name
              </label>
              <Input
                type="text"
                placeholder="Linus Torvalds"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isRegistering}
                className="h-12 bg-card border-border/50 text-foreground placeholder:text-muted-foreground focus:border-accent"
              />
            </div>

            {/* ─── NOM ENTREPRISE (recruteur seulement) ─── */}
            {role === "recruiter" && (
              <div className="space-y-2">
                <label className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  Company Name
                </label>
                <Input
                  type="text"
                  placeholder="Acme Corp"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  disabled={isRegistering}
                  className="h-12 bg-card border-border/50 text-foreground placeholder:text-muted-foreground focus:border-accent"
                />
              </div>
            )}

            {/* ─── EMAIL ─── */}
            <div className="space-y-2">
              <label className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Professional Email
              </label>
              <Input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isRegistering}
                className="h-12 bg-card border-border/50 text-foreground placeholder:text-muted-foreground focus:border-accent"
              />
            </div>

            {/* ─── MOT DE PASSE ─── */}
            <div className="space-y-2">
              <label className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isRegistering}
                  className="h-12 bg-card border-border/50 text-foreground placeholder:text-muted-foreground focus:border-accent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                Must be at least 8 characters.
              </p>
            </div>

            {/* ─── CONDITIONS ─── */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) =>
                  setAgreedToTerms(checked as boolean)
                }
                disabled={isRegistering}
                className="mt-0.5 border-border/50 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{" "}
                <Link href="/terms" className="text-accent hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/security" className="text-accent hover:underline">
                  Security Protocols
                </Link>
                .
              </label>
            </div>

            {/* ─── BOUTON SUBMIT ─── */}
            <Button
              type="submit"
              disabled={
                !agreedToTerms ||
                isRegistering ||
                !fullName ||
                !email ||
                !password ||
                (role === "recruiter" && !companyName)
              }
              className="w-full h-12 bg-primary-button text-primary-button-foreground hover:bg-primary-button/90 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              {isRegistering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="my-8 border-t border-border/30"></div>

          <p className="text-center text-sm text-muted-foreground">
            Already authenticated?{" "}
            <Link
              href="/login"
              className="text-foreground hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>

        {/* Security Badges */}
        <div className="flex items-center justify-center gap-12 mt-12">
          <div className="flex flex-col items-center gap-2">
            <Shield className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground">
              ISO-27001
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Terminal className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground">
              v4.0 API
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Lock className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground">
              AES-256
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 border-t border-border/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm font-mono text-muted-foreground">
            SkillForge_v2.0.4
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/docs"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Documentation
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link
              href="/security"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Security Architecture
            </Link>
            <Link
              href="/status"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              System Status
            </Link>
          </nav>
          <p className="text-sm text-accent">
            &copy; 2026 SkillForge Engineering. Technical Precision Guaranteed.
          </p>
        </div>
      </footer>
    </div>
  );
}
