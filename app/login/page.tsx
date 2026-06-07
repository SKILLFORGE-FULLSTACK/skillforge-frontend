"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Github, Moon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/skillforge/logo";
import { useAuth } from "@/lib/hooks/useAuth";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ─── HOOK AUTH ──────────────────────────────────────────────
  const { login, isLoggingIn } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-border/30">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-accent">FR/EN</span>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Moon className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Hero */}
        <div className="hidden lg:flex flex-col justify-center flex-1 px-16 py-12 bg-card/30">
          <div className="max-w-lg">
            <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider text-accent-secondary bg-accent-secondary/10 rounded-full mb-8">
              ENGINEERING-GRADE PLATFORM
            </span>
            <h1 className="text-4xl xl:text-5xl font-bold text-foreground leading-tight mb-6">
              Master the <span className="text-accent">Architecture</span> of
              Innovation.
            </h1>
            <p className="text-lg text-muted-foreground mb-12">
              Access high-precision certification tracks designed for elite
              software engineers and technical architects.
            </p>
            <div className="flex gap-4">
              <div className="flex-1 p-4 bg-card/50 border border-border/50 rounded-lg">
                <div className="w-10 h-10 flex items-center justify-center bg-accent/10 rounded-lg mb-3">
                  <svg
                    className="w-5 h-5 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-mono text-muted-foreground">
                  Precision Tools
                </span>
              </div>
              <div className="flex-1 p-4 bg-card/50 border border-border/50 rounded-lg">
                <div className="w-10 h-10 flex items-center justify-center bg-accent-secondary/10 rounded-lg mb-3">
                  <svg
                    className="w-5 h-5 text-accent-secondary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-mono text-muted-foreground">
                  Verified Tracks
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex-1 flex items-center justify-center px-8 py-12 bg-background">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Welcome Back
            </h2>
            <p className="text-muted-foreground mb-8">
              Identify yourself to access the forge.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="engineer@skillforge.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoggingIn}
                    className="pl-12 h-12 bg-card border-border/50 text-foreground placeholder:text-muted-foreground focus:border-accent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-accent hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoggingIn}
                    className="pl-12 h-12 bg-card border-border/50 text-foreground placeholder:text-muted-foreground focus:border-accent"
                  />
                </div>
              </div>

              {/* ─── BOUTON SUBMIT avec loading ─── */}
              <Button
                type="submit"
                disabled={isLoggingIn || !email || !password}
                className="w-full h-12 bg-primary-button text-primary-button-foreground hover:bg-primary-button/90 font-medium disabled:opacity-50">
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In to Dashboard"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-4 text-muted-foreground tracking-wider">
                  Or Connect Via
                </span>
              </div>
            </div>

            {/* Social Login — désactivé pour l'instant */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                disabled
                className="flex-1 h-12 bg-card border-border/50 text-foreground hover:bg-card/80 disabled:opacity-50">
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </Button>
              <Button
                variant="outline"
                disabled
                className="flex-1 h-12 bg-card border-border/50 text-foreground hover:bg-card/80 disabled:opacity-50">
                <GoogleIcon className="mr-2 h-5 w-5" />
                Google
              </Button>
            </div>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              New to the platform?{" "}
              <Link
                href="/register"
                className="text-accent hover:underline font-medium">
                Request access track
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-8 py-6 border-t border-border/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm font-mono text-muted-foreground">
            SkillForge
            <br />
            Engineering
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
