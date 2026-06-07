"use client";

import { use } from "react";
import { useDeveloper, useSaveProfile, useUnsaveProfile, useContactDeveloper } from "@/lib/hooks/useMarketplace";
import { ScoreCircle, SkillBadge, ContributionHeatmap } from "@/components/skillforge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MapPin,
  MessageSquare,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Award,
  Loader2,
  AlertCircle,
  Flame,
} from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function CandidateProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: username } = use(params);
  const { data, isLoading, error } = useDeveloper(username);
  const { mutate: save } = useSaveProfile();
  const { mutate: unsave } = useUnsaveProfile();
  const { mutate: contact, isPending: isContacting } = useContactDeveloper();
  const [isSaved, setIsSaved] = useState(data?.is_saved ?? false);
  const [showContact, setShowContact] = useState(false);
  const [message, setMessage] = useState("");

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          <AlertCircle className="w-5 h-5" />
          <span>Profil introuvable.</span>
        </div>
      </div>
    );
  }

  const { developer: dev } = data;

  const toggleSave = () => {
    if (isSaved) {
      unsave(dev.id);
      setIsSaved(false);
    } else {
      save({ developerId: dev.id });
      setIsSaved(true);
    }
  };

  const handleContact = () => {
    contact(
      { developer_id: dev.id, message },
      { onSuccess: () => { setShowContact(false); setMessage(""); } },
    );
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Card */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex items-start gap-4 flex-1">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary/20 text-2xl text-primary font-bold">
                    {dev.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-foreground">{dev.name}</h1>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    {dev.is_available && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                        Disponible
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">@{dev.username}</p>
                  {dev.profile?.headline && (
                    <p className="text-foreground mt-1">{dev.profile.headline}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                    {dev.profile?.location_city && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {dev.profile.location_city}
                        {dev.profile.location_country && `, ${dev.profile.location_country}`}
                      </span>
                    )}
                    {dev.current_streak > 0 && (
                      <span className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-warning" />
                        {dev.current_streak} jours de streak
                      </span>
                    )}
                  </div>
                  {dev.profile?.target_salary_min && dev.profile.target_salary_max && (
                    <Badge variant="outline" className="mt-2">
                      {dev.profile.target_salary_min.toLocaleString()}–
                      {dev.profile.target_salary_max.toLocaleString()} €/an
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 shrink-0">
                <ScoreCircle
                  score={dev.profile?.overall_score ?? 0}
                  maxScore={100}
                  size="lg"
                  label="Score Global"
                />
                <div className="flex gap-2">
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => setShowContact(true)}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contacter
                  </Button>
                  <Button variant="outline" onClick={toggleSave}>
                    {isSaved ? (
                      <BookmarkCheck className="w-4 h-4 text-primary" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column — Skills & Stats */}
          <div className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">
                  Compétences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {dev.skills.map((s) => (
                  <div key={s.name} className="flex items-center justify-between">
                    <SkillBadge label={s.name} variant={s.is_certified ? "primary" : "outline"} />
                    <span className="text-xs text-muted-foreground capitalize">{s.level}</span>
                  </div>
                ))}
                {dev.skills.length === 0 && (
                  <p className="text-sm text-muted-foreground">Aucune compétence renseignée</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">
                  Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Niveau</span>
                  <span className="font-semibold text-foreground">Lv.{dev.level}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">XP Total</span>
                  <span className="font-semibold text-foreground">
                    {dev.xp_total.toLocaleString()}
                  </span>
                </div>
                {dev.profile && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Score interview</span>
                      <span className="font-semibold text-foreground">
                        {dev.profile.interview_score}/100
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Score certif.</span>
                      <span className="font-semibold text-foreground">
                        {dev.profile.cert_score}/100
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Certifications</span>
                      <span className="font-semibold text-foreground">
                        {dev.profile.certifications_count}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column — Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="badges">
              <TabsList className="bg-muted">
                <TabsTrigger value="badges">Badges & Certifications</TabsTrigger>
                <TabsTrigger value="activity">Activité</TabsTrigger>
              </TabsList>

              <TabsContent value="badges" className="mt-4">
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    {dev.badges.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Aucun badge obtenu
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dev.badges.map((badge, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                              <Award className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{badge.title}</p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {badge.badge_type} ·{" "}
                                {new Date(badge.issued_at).toLocaleDateString("fr-FR")}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="mt-4">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Activité de préparation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ContributionHeatmap data={[]} />
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Données d'activité privées par défaut
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Contact Dialog */}
      <Dialog open={showContact} onOpenChange={() => { setShowContact(false); setMessage(""); }}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle>Contacter {dev.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Bonjour, je suis recruteur chez... et j'ai une opportunité intéressante..."
              rows={5}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
            />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowContact(false)} className="flex-1">
                Annuler
              </Button>
              <Button
                onClick={handleContact}
                disabled={isContacting || !message.trim()}
                className="flex-1 bg-primary hover:bg-primary/90">
                {isContacting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Envoyer"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
