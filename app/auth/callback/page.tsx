"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/lib/stores/authStore";
import { Logo } from "@/components/skillforge/logo";

const ERROR_MESSAGES: Record<string, string> = {
  email_missing:
    "Votre compte ne partage pas d'adresse email publique. Essayez une autre méthode de connexion.",
  oauth_failed: "La connexion a échoué. Veuillez réessayer.",
};

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = searchParams.get("token");
    const oauthError = searchParams.get("error");

    if (oauthError) {
      setError(ERROR_MESSAGES[oauthError] ?? ERROR_MESSAGES.oauth_failed);
      return;
    }

    if (!token) {
      setError("Lien de connexion invalide.");
      return;
    }

    // Nécessaire avant l'appel /me : l'intercepteur axios lit le token en localStorage.
    localStorage.setItem("skillforge_token", token);

    authApi
      .me()
      .then((user) => {
        setAuth(user, token);
        router.replace(user.role === "recruiter" ? "/recruiter" : "/dashboard");
      })
      .catch(() => {
        localStorage.removeItem("skillforge_token");
        setError("Impossible de récupérer votre profil. Veuillez réessayer.");
      });
  }, [searchParams, setAuth, router]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background px-4 text-center">
        <Logo />
        <p className="text-muted-foreground max-w-sm">{error}</p>
        <a
          href="/login"
          className="text-accent hover:underline text-sm font-medium">
          Retour à la connexion
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
      <Logo />
      <Loader2 className="h-6 w-6 animate-spin text-accent" />
      <p className="text-sm text-muted-foreground">Connexion en cours…</p>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <OAuthCallbackContent />
    </Suspense>
  );
}
