"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/skillforge/logo";
import { useT } from "@/lib/i18n/useTranslation";

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold mb-2">Conditions d'utilisation</h1>
        <p className="text-sm text-muted-foreground">
          Dernière mise à jour : 2026. SkillForge est en phase de lancement — ces
          conditions seront étoffées au fur et à mesure de l'évolution du service.
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Le service</h2>
        <p className="text-muted-foreground">
          SkillForge propose aux développeurs des entretiens d'entraînement simulés par
          IA (écrits et vocaux), des certifications basées sur des projets réels, et une
          mise en relation avec des recruteurs. Les recruteurs peuvent y publier des
          offres d'emploi et rechercher des profils.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Votre compte</h2>
        <p className="text-muted-foreground">
          Vous êtes responsable de la confidentialité de vos identifiants et de
          l'exactitude des informations que vous fournissez. Un compte est personnel et
          ne doit pas être partagé.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Contenu publié</h2>
        <p className="text-muted-foreground">
          Vous restez propriétaire du contenu que vous publiez (réponses d'entretien,
          soumissions de certification, messages du forum, offres d'emploi). Vous nous
          accordez le droit de le traiter (y compris via des services d'IA tiers) dans le
          seul but de fournir le service.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Usage raisonnable</h2>
        <p className="text-muted-foreground">
          Certaines fonctionnalités (entretiens vocaux notamment) sont soumises à des
          quotas d'usage raisonnable pour garantir la disponibilité du service à tous les
          utilisateurs.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Contact</h2>
        <p className="text-muted-foreground">
          Pour toute question relative à ces conditions, contactez-nous à{" "}
          <span className="text-foreground">legal@skillforge.io</span>.
        </p>
      </section>
    </div>
  );
}

function EnglishContent() {
  return (
    <div className="space-y-8 text-foreground">
      <div>
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: 2026. SkillForge is in launch phase — these terms will be
          expanded as the service evolves.
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">The service</h2>
        <p className="text-muted-foreground">
          SkillForge offers developers AI-simulated practice interviews (written and
          voice), project-based certifications, and connections with recruiters.
          Recruiters can post job openings and search for candidate profiles.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Your account</h2>
        <p className="text-muted-foreground">
          You are responsible for keeping your credentials confidential and for the
          accuracy of the information you provide. An account is personal and must not
          be shared.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Content you publish</h2>
        <p className="text-muted-foreground">
          You retain ownership of content you publish (interview answers, certification
          submissions, forum posts, job postings). You grant us the right to process it
          (including via third-party AI services) solely to provide the service.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Fair use</h2>
        <p className="text-muted-foreground">
          Certain features (notably voice interviews) are subject to fair-use quotas to
          keep the service available to all users.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Contact</h2>
        <p className="text-muted-foreground">
          For any questions about these terms, contact us at{" "}
          <span className="text-foreground">legal@skillforge.io</span>.
        </p>
      </section>
    </div>
  );
}
