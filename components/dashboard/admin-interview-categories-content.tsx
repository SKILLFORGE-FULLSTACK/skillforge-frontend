"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PageLoader } from "@/components/ui/page-loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, AlertCircle, Loader2 } from "lucide-react";
import {
  useAdminInterviewCategories,
  useCreateInterviewCategory,
  useUpdateInterviewCategory,
  useDeleteInterviewCategory,
} from "@/lib/hooks/useInterviewCategories";
import { InterviewCategory, InterviewCategoryPayload } from "@/lib/types";
import { useT } from "@/lib/i18n/useTranslation";

const DIFFICULTIES: InterviewCategoryPayload["default_difficulty"][] = [
  "easy",
  "medium",
  "hard",
  "expert",
];

const EMPTY_FORM: InterviewCategoryPayload = {
  key: "",
  label: "",
  description: "",
  default_difficulty: "medium",
  stack_focus: "",
  is_active: true,
  sort_order: 0,
};

export function AdminInterviewCategoriesContent() {
  const { t } = useT();
  const { data: categories, isLoading, error } = useAdminInterviewCategories();
  const { mutate: createCategory, isPending: isCreating } = useCreateInterviewCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateInterviewCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteInterviewCategory();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<InterviewCategory | null>(null);
  const [form, setForm] = useState<InterviewCategoryPayload>(EMPTY_FORM);
  const [toDelete, setToDelete] = useState<InterviewCategory | null>(null);

  const difficultyLabel = (d: string) =>
    ({
      easy: t("admin.difficultyEasy"),
      medium: t("admin.difficultyMedium"),
      hard: t("admin.difficultyHard"),
      expert: t("admin.difficultyExpert"),
    })[d] ?? d;

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (cat: InterviewCategory) => {
    setEditing(cat);
    setForm({
      key: cat.key,
      label: cat.label,
      description: cat.description ?? "",
      default_difficulty: cat.default_difficulty,
      stack_focus: cat.stack_focus ?? "",
      is_active: cat.is_active,
      sort_order: cat.sort_order,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    const payload: InterviewCategoryPayload = {
      ...form,
      description: form.description || undefined,
      stack_focus: form.stack_focus || undefined,
    };
    if (editing) {
      updateCategory(
        { id: editing.id, payload },
        { onSuccess: () => setDialogOpen(false) },
      );
    } else {
      createCategory(payload, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const isSaving = isCreating || isUpdating;

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("admin.categoriesTitle")}</h1>
          <p className="text-muted-foreground">{t("admin.categoriesSubtitle")}</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 cursor-pointer" onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          {t("admin.newCategory")}
        </Button>
      </div>

      {isLoading && <PageLoader />}

      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          <AlertCircle className="w-5 h-5" />
          <span>{t("admin.errorLoad")}</span>
        </div>
      )}

      {!isLoading && !error && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.columnKey")}</TableHead>
                <TableHead>{t("admin.columnLabel")}</TableHead>
                <TableHead>{t("admin.columnDifficulty")}</TableHead>
                <TableHead>{t("admin.columnStatus")}</TableHead>
                <TableHead className="text-right">{t("admin.columnActions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(categories ?? []).map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{cat.key}</TableCell>
                  <TableCell className="font-medium text-foreground">{cat.label}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{difficultyLabel(cat.default_difficulty)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        cat.is_active
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-muted text-muted-foreground"
                      }>
                      {cat.is_active ? t("admin.active") : t("admin.inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => openEdit(cat)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer text-destructive hover:text-destructive"
                      onClick={() => setToDelete(cat)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(categories ?? []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {t("admin.empty")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle>{editing ? t("admin.editCategory") : t("admin.newCategory")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="cat-key">{t("admin.key")}</Label>
              <Input
                id="cat-key"
                value={form.key}
                onChange={(e) => setForm((f) => ({ ...f, key: e.target.value }))}
                placeholder="ex: system_design"
              />
              <p className="text-xs text-muted-foreground">{t("admin.keyHint")}</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-label">{t("admin.label")}</Label>
              <Input
                id="cat-label"
                value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-description">{t("admin.description")}</Label>
              <Textarea
                id="cat-description"
                value={form.description ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>{t("admin.defaultDifficulty")}</Label>
                <Select
                  value={form.default_difficulty}
                  onValueChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      default_difficulty: v as InterviewCategoryPayload["default_difficulty"],
                    }))
                  }>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTIES.map((d) => (
                      <SelectItem key={d} value={d}>
                        {difficultyLabel(d)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cat-sort">{t("admin.sortOrder")}</Label>
                <Input
                  id="cat-sort"
                  type="number"
                  value={form.sort_order ?? 0}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-stack">{t("admin.stackFocus")}</Label>
              <Input
                id="cat-stack"
                value={form.stack_focus ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, stack_focus: e.target.value }))}
                placeholder="ex: frontend, backend"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <Label htmlFor="cat-active">{t("admin.active")}</Label>
                <p className="text-xs text-muted-foreground">{t("admin.activeHint")}</p>
              </div>
              <Switch
                id="cat-active"
                checked={form.is_active ?? true}
                onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" className="cursor-pointer" onClick={() => setDialogOpen(false)}>
              {t("admin.cancel")}
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 cursor-pointer"
              disabled={isSaving || !form.key || !form.label}
              onClick={handleSubmit}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {t("admin.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={t("admin.deleteCategory")}
        description={t("admin.deleteCategoryConfirm")}
        confirmLabel={t("admin.deleteCategory")}
        cancelLabel={t("admin.cancel")}
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={() => {
          if (toDelete) deleteCategory(toDelete.id);
        }}
      />
    </div>
  );
}
