"use client";

import { DashboardHeader } from "@/components/dashboard";
import { useForumPosts, useCreatePost } from "@/lib/hooks/useForum";
import { MessageSquare, ThumbsUp, Eye, CheckCircle2, Plus, Search, Tag, Loader2 } from "lucide-react";
import { PageLoader } from "@/components/ui/page-loader";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useT } from "@/lib/i18n/useTranslation";

export default function ForumPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", tags: "" });

  const { data, isLoading } = useForumPosts({ search: search || undefined, sort });
  const { mutate: createPost, isPending: isCreating } = useCreatePost();
  const { t, tDate } = useT();

  const SORT_OPTIONS = [
    { label: t("forum.sortRecent"), value: "recent" },
    { label: t("forum.sortPopular"), value: "popular" },
    { label: t("forum.sortUnanswered"), value: "unanswered" },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = form.tags.split(",").map((tag) => tag.trim()).filter(Boolean);
    createPost(
      { title: form.title, body: form.body, tags },
      {
        onSuccess: () => {
          setShowCreate(false);
          setForm({ title: "", body: "", tags: "" });
        },
      },
    );
  };

  return (
    <>
      <DashboardHeader />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-primary" />
                {t("forum.title")}
              </h1>
              <p className="text-muted-foreground">{t("forum.subtitle")}</p>
            </div>
            <Button onClick={() => setShowCreate(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              {t("forum.newQuestion")}
            </Button>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t("forum.searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
            <div className="flex gap-2">
              {SORT_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSort(s.value)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    sort === s.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-muted-foreground hover:bg-secondary"
                  }`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <PageLoader />
          ) : data?.data.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">{t("forum.empty")}</p>
              <p className="text-sm mt-1">{t("forum.emptyHint")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data?.data.map((post) => (
                <Link
                  key={post.id}
                  href={`/dashboard/forum/${post.id}`}
                  className="block bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                      <ThumbsUp className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">{post.votes}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {post.is_pinned && (
                          <span className="text-xs px-1.5 py-0.5 bg-primary/20 text-primary rounded">
                            {t("forum.pinned")}
                          </span>
                        )}
                        {post.has_accepted_answer && (
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        )}
                        <h3 className="font-semibold text-foreground truncate">{post.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{post.body}</p>
                      <div className="flex items-center gap-4 flex-wrap">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="flex items-center gap-1 text-xs px-2 py-0.5 bg-secondary rounded text-muted-foreground">
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                        <span className="text-xs text-muted-foreground ml-auto flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {post.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" /> {post.answers_count}
                          </span>
                          <span>{t("forum.by")} {post.author?.name ?? t("forum.anonymous")}</span>
                          <span>·</span>
                          <span>{tDate(post.created_at)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {data && data.meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground">
                {t("forum.page")} {data.meta.current_page} / {data.meta.last_page}
              </span>
            </div>
          )}
        </div>
      </main>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle>{t("forum.dialogTitle")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                {t("forum.dialogTitleLabel")}
              </label>
              <Input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder={t("forum.dialogTitlePlaceholder")}
                required
                className="bg-secondary border-border"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                {t("forum.dialogDescLabel")}
              </label>
              <textarea
                value={form.body}
                onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
                placeholder={t("forum.dialogDescPlaceholder")}
                required
                rows={6}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                {t("forum.dialogTagsLabel")}
              </label>
              <Input
                value={form.tags}
                onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                placeholder={t("forum.dialogTagsPlaceholder")}
                className="bg-secondary border-border"
              />
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)} className="flex-1">
                {t("forum.cancel")}
              </Button>
              <Button type="submit" disabled={isCreating} className="flex-1 bg-primary hover:bg-primary/90">
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : t("forum.publish")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
