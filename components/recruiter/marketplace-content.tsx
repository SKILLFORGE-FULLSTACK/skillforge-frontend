"use client";

import { Search, SlidersHorizontal, X, Bookmark, BookmarkCheck, Loader2, AlertCircle, MessageSquare } from "lucide-react";
import { PageLoader } from "@/components/ui/page-loader";
import { SkillBadge } from "@/components/skillforge";
import { useState } from "react";
import { useDevelopers, useSaveProfile, useUnsaveProfile, useContactDeveloper } from "@/lib/hooks/useMarketplace";
import { SearchFilters, Developer } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/lib/hooks/useDebounce";

export function MarketplaceContent() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({ per_page: 12 });
  const [contactDev, setContactDev] = useState<Developer | null>(null);
  const [message, setMessage] = useState("");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const debouncedSearch = useDebounce(searchInput, 400);
  const activeFilters: SearchFilters = { ...filters, search: debouncedSearch || undefined };

  const { data, isLoading, error } = useDevelopers(activeFilters);
  const { mutate: save, isPending: isSaving } = useSaveProfile();
  const { mutate: unsave } = useUnsaveProfile();
  const { mutate: contact, isPending: isContacting } = useContactDeveloper();

  const toggleSave = (dev: Developer) => {
    if (savedIds.has(dev.id)) {
      unsave(dev.id);
      setSavedIds((prev) => { const n = new Set(prev); n.delete(dev.id); return n; });
    } else {
      save({ developerId: dev.id });
      setSavedIds((prev) => new Set(prev).add(dev.id));
    }
  };

  const handleContact = () => {
    if (!contactDev || !message.trim()) return;
    contact(
      { developer_id: contactDev.id, message },
      {
        onSuccess: () => {
          setContactDev(null);
          setMessage("");
        },
      },
    );
  };

  return (
    <div className="p-6">
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Search Header */}
          <div className="mb-6">
            <h2 className="text-sm text-muted-foreground mb-2">Rechercher des développeurs</h2>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, rôle ou stack technique..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          {/* Active Filter Tags */}
          {filters.work_mode || filters.is_available !== undefined ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.work_mode && (
                <span className="flex items-center gap-2 px-3 py-1.5 bg-secondary text-sm rounded-lg">
                  Mode: {filters.work_mode}
                  <button
                    onClick={() => setFilters((p) => ({ ...p, work_mode: undefined }))}
                    className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.is_available && (
                <span className="flex items-center gap-2 px-3 py-1.5 bg-secondary text-sm rounded-lg">
                  Disponible
                  <button
                    onClick={() => setFilters((p) => ({ ...p, is_available: undefined }))}
                    className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          ) : null}

          {isLoading && <PageLoader />}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive mb-4">
              <AlertCircle className="w-5 h-5" />
              <span>Erreur lors du chargement des développeurs.</span>
            </div>
          )}

          {/* Developer Grid */}
          {!isLoading && !error && (
            <>
              <div className="text-sm text-muted-foreground mb-4">
                {data?.meta.total ?? 0} développeur(s) trouvé(s)
              </div>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {data?.data.map((dev) => (
                  <div key={dev.id} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-foreground font-semibold text-lg shrink-0">
                        {dev.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{dev.name}</h3>
                        <p className="text-sm text-primary truncate">
                          {dev.profile?.headline ?? "Développeur"}
                        </p>
                        <p className="text-xs text-muted-foreground">@{dev.username}</p>
                      </div>
                      {dev.is_available && (
                        <span className="shrink-0 text-xs px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded">
                          Dispo
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {dev.skills.slice(0, 4).map((s) => (
                        <SkillBadge key={s.name} label={s.name} variant="outline" />
                      ))}
                    </div>

                    <div className="flex items-center gap-2 mb-3 text-sm">
                      <span className="text-muted-foreground">Lv.{dev.level}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-foreground">{dev.xp_total.toLocaleString()} XP</span>
                      {dev.current_streak > 0 && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-accent text-xs">{dev.current_streak}🔥</span>
                        </>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/recruiter/candidates/${dev.username}`)}
                        className="flex-1 px-3 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors">
                        Voir le profil
                      </button>
                      <button
                        onClick={() => setContactDev(dev)}
                        className="p-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                        title="Contacter">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => toggleSave(dev)}
                        disabled={isSaving}
                        className="p-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                        title={savedIds.has(dev.id) ? "Retirer des favoris" : "Sauvegarder"}>
                        {savedIds.has(dev.id) ? (
                          <BookmarkCheck className="w-4 h-4 text-primary" />
                        ) : (
                          <Bookmark className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {data && data.meta.last_page > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button
                    disabled={(filters.page ?? 1) <= 1}
                    onClick={() => setFilters((p) => ({ ...p, page: (p.page ?? 1) - 1 }))}
                    className="px-3 py-1 border border-border rounded text-sm disabled:opacity-40 hover:bg-secondary">
                    Précédent
                  </button>
                  <span className="text-sm text-muted-foreground">
                    Page {data.meta.current_page} / {data.meta.last_page}
                  </span>
                  <button
                    disabled={(filters.page ?? 1) >= data.meta.last_page}
                    onClick={() => setFilters((p) => ({ ...p, page: (p.page ?? 1) + 1 }))}
                    className="px-3 py-1 border border-border rounded text-sm disabled:opacity-40 hover:bg-secondary">
                    Suivant
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Deep Filters Sidebar */}
        <div className="w-64 shrink-0">
          <DeepFilters filters={filters} onChange={setFilters} />
        </div>
      </div>

      {/* Contact Dialog */}
      <Dialog open={!!contactDev} onOpenChange={() => { setContactDev(null); setMessage(""); }}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle>Contacter {contactDev?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Bonjour, je suis recruteur chez... et j'aimerais discuter d'une opportunité..."
              rows={5}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
            />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setContactDev(null)} className="flex-1">
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

function DeepFilters({
  filters,
  onChange,
}: {
  filters: SearchFilters;
  onChange: (f: SearchFilters) => void;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 sticky top-6">
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
        <h3 className="font-semibold text-foreground">Filtres</h3>
      </div>

      {/* Work Mode */}
      <div className="mb-6">
        <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-2">
          MODE DE TRAVAIL
        </span>
        <div className="space-y-2">
          {["remote", "hybrid", "on_site"].map((mode) => (
            <label key={mode} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="work_mode"
                checked={filters.work_mode === mode}
                onChange={() => onChange({ ...filters, work_mode: mode })}
                className="w-4 h-4 border-border bg-secondary text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground capitalize">{mode.replace("_", "-")}</span>
            </label>
          ))}
          {filters.work_mode && (
            <button
              onClick={() => onChange({ ...filters, work_mode: undefined })}
              className="text-xs text-primary hover:underline mt-1">
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* Availability */}
      <div className="mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.is_available}
            onChange={(e) =>
              onChange({ ...filters, is_available: e.target.checked ? true : undefined })
            }
            className="w-4 h-4 rounded border-border bg-secondary text-primary focus:ring-primary"
          />
          <span className="text-sm text-foreground">Disponible seulement</span>
        </label>
      </div>

      {/* Sort */}
      <div className="mb-6">
        <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-2">
          TRIER PAR
        </span>
        <select
          value={filters.sort ?? "score"}
          onChange={(e) => onChange({ ...filters, sort: e.target.value })}
          className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none">
          <option value="score">Score global</option>
          <option value="xp">XP total</option>
          <option value="recent">Récent</option>
        </select>
      </div>

      {/* Reset */}
      <button
        onClick={() => onChange({ per_page: 12 })}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-secondary transition-colors">
        Réinitialiser
      </button>
    </div>
  );
}
