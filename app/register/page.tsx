"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Shield, Terminal, Lock, Loader2, ArrowLeft, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/skillforge/logo";
import { useAuth } from "@/lib/hooks/useAuth";
import { useT } from "@/lib/i18n/useTranslation";
import { LocaleToggle } from "@/components/ui/locale-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getOAuthRedirectUrl, type OAuthProvider } from "@/lib/api";
import { toast } from "sonner";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function RegisterPageContent() {
  const searchParams = useSearchParams();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [role, setRole] = useState<"developer" | "recruiter">(
    searchParams.get("role") === "recruiter" ? "recruiter" : "developer",
  );
  const [companyName, setCompanyName] = useState("");

  const { register, isRegistering } = useAuth();
  const { t, locale, setLocale } = useT();

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

  const handleOAuthRegister = (provider: OAuthProvider) => {
    if (role === "recruiter" && !companyName.trim()) {
      toast.error("Veuillez indiquer le nom de votre entreprise avant de continuer.");
      return;
    }
    window.location.href = getOAuthRedirectUrl(provider, {
      role,
      companyName: role === "recruiter" ? companyName.trim() : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-border/30">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Retour
          </Link>
          <div className="h-4 w-px bg-border/50" />
          <Logo />
        </div>
        <div className="flex items-center gap-4">
          <LocaleToggle />
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-muted-foreground border border-border/50 rounded-lg hover:bg-card hover:text-foreground transition-colors">
            {t("auth.register.signIn")}
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground italic mb-4">
            {t("auth.register.title")}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t("auth.register.subtitle")}
          </p>
        </div>

        <div className="w-full max-w-md p-8 bg-card/30 border border-border/50 rounded-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role */}
            <div className="space-y-2">
              <label className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                {t("auth.register.role")}
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
                  {t("auth.register.developer")}
                </button>
                <button
                  type="button"
                  onClick={() => setRole("recruiter")}
                  className={`h-12 rounded-lg border text-sm font-medium transition-all ${
                    role === "recruiter"
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border/50 bg-card text-muted-foreground hover:border-accent/50"
                  }`}>
                  {t("auth.register.recruiter")}
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                {t("auth.register.fullName")}
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

            {/* Company Name (recruiter only) */}
            {role === "recruiter" && (
              <div className="space-y-2">
                <label className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  {t("auth.register.companyName")}
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

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                {t("auth.register.email")}
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

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                {t("auth.register.password")}
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
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                {t("auth.register.passwordHint")}
              </p>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                disabled={isRegistering}
                className="mt-0.5 border-border/50 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                {t("auth.register.termsText")}{" "}
                <Link href="/terms" className="text-accent hover:underline">
                  {t("auth.register.termsLink")}
                </Link>{" "}
                {t("auth.register.termsAnd")}{" "}
                <Link href="/privacy" className="text-accent hover:underline">
                  {t("auth.register.securityLink")}
                </Link>
                .
              </label>
            </div>

            {/* Submit */}
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
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-medium tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed">
              {isRegistering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("auth.register.submitting")}
                </>
              ) : (
                t("auth.register.submit")
              )}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-4 text-muted-foreground tracking-wider">
                {t("auth.login.divider") !== "auth.login.divider" ? t("auth.login.divider") : "ou"}
              </span>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthRegister("github")}
              disabled={isRegistering}
              className="flex-1 h-12 bg-card border-border/50 text-foreground hover:bg-card/80 hover:text-foreground disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
              <Github className="mr-2 h-5 w-5" />
              GitHub
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthRegister("google")}
              disabled={isRegistering}
              className="flex-1 h-12 bg-card border-border/50 text-foreground hover:bg-card/80 hover:text-foreground disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
              <GoogleIcon className="mr-2 h-5 w-5" />
              Google
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            {t("auth.register.alreadyAuth")}{" "}
            <Link href="/login" className="text-foreground hover:underline font-medium">
              {t("auth.register.signInLink")}
            </Link>
          </p>
        </div>

        {/* Security Badges */}
        <div className="flex items-center justify-center gap-12 mt-12">
          <div className="flex flex-col items-center gap-2">
            <Shield className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground">ISO-27001</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Terminal className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground">v4.0 API</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Lock className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground">AES-256</span>
          </div>
        </div>
      </main>

      <footer className="px-8 py-6 border-t border-border/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm font-mono text-muted-foreground">SkillForge</div>
          <nav className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("landing.footer.links.privacy")}</Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("landing.footer.links.terms")}</Link>
          </nav>
          <p className="text-sm text-accent">{t("landing.footer.copyright")}</p>
        </div>
      </footer>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterPageContent />
    </Suspense>
  );
}
