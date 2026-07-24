"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/skillforge/logo";
import { useT } from "@/lib/i18n/useTranslation";

export default function PrivacyPage() {
  const { locale } = useT();

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-4 px-8 py-4 border-b border-border/30">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          {locale === "fr" ? "Retour" : "Back"}
        </Link>
        <div className="h-4 w-px bg-border/50" />
        <Logo />
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {locale === "fr" ? <FrenchContent /> : <EnglishContent />}
      </main>
    </div>
  );
}

function FrenchContent() {
  return (
    <div className="space-y-8 text-foreground">
      <div>
        <h1 className="text-3xl font-bold mb-2">Politique de confidentialité</h1>
        <p className="text-sm text-muted-foreground">
          Dernière mise à jour : 2026. SkillForge est en phase de lancement — ce document
          sera étoffé au fur et à mesure de l'évolution du service.
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Données que nous collectons</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Informations de compte : nom, email, mot de passe (chiffré) ou profil OAuth (Google/GitHub)</li>
          <li>Données d'utilisation : entretiens réalisés, certifications, scores, historique XP</li>
          <li>Enregistrements audio pour les entretiens vocaux IA (transcription et synthèse vocale)</li>
          <li>Contenu que vous publiez : offres d'emploi, messages du forum, candidatures</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Comment nous utilisons ces données</h2>
        <p className="text-muted-foreground">
          Vos données servent uniquement à faire fonctionner la plateforme : personnaliser
          vos entretiens et certifications, calculer vos scores, et — si vous êtes
          développeur avec un profil public — vous rendre visible auprès des recruteurs.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Sous-traitants tiers</h2>
        <p className="text-muted-foreground">
          Certaines fonctionnalités s'appuient sur des services tiers : Groq (analyse IA,
          transcription et synthèse vocale des entretiens), Google (connexion OAuth et
          traduction de contenu), GitHub (connexion OAuth). Ces prestataires ne reçoivent
          que les données strictement nécessaires au traitement demandé.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Vos droits</h2>
        <p className="text-muted-foreground">
          Vous pouvez demander l'accès, la correction ou la suppression de vos données à
          tout moment en nous contactant.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Contact</h2>
        <p className="text-muted-foreground">
          Pour toute question relative à vos données, contactez-nous à{" "}
          <span className="text-foreground">privacy@skillforge.io</span>.
        </p>
      </section>
    </div>
  );
}

function EnglishContent() {
  return (
    <div className="space-y-8 text-foreground">
      <div>
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: 2026. SkillForge is in launch phase — this document will be
          expanded as the service evolves.
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Data we collect</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Account information: name, email, password (encrypted), or OAuth profile (Google/GitHub)</li>
          <li>Usage data: interviews completed, certifications, scores, XP history</li>
          <li>Audio recordings for AI voice interviews (transcription and speech synthesis)</li>
          <li>Content you publish: job postings, forum messages, applications</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">How we use this data</h2>
        <p className="text-muted-foreground">
          Your data is used solely to operate the platform: personalizing your interviews
          and certifications, computing your scores, and — if you're a developer with a
          public profile — making you visible to recruiters.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Third-party processors</h2>
        <p className="text-muted-foreground">
          Some features rely on third-party services: Groq (AI analysis, interview
          transcription and speech synthesis), Google (OAuth sign-in and content
          translation), GitHub (OAuth sign-in). These providers only receive the data
          strictly necessary for the requested processing.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Your rights</h2>
        <p className="text-muted-foreground">
          You can request access to, correction of, or deletion of your data at any time
          by contacting us.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Contact</h2>
        <p className="text-muted-foreground">
          For any questions about your data, contact us at{" "}
          <span className="text-foreground">privacy@skillforge.io</span>.
        </p>
      </section>
    </div>
  );
}
