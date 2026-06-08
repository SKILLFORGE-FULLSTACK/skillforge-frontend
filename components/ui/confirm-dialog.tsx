"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "default";
  isLoading?: boolean;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  variant = "destructive",
  isLoading = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                variant === "destructive"
                  ? "bg-destructive/15"
                  : "bg-primary/15"
              }`}>
              <AlertTriangle
                className={`w-5 h-5 ${
                  variant === "destructive" ? "text-destructive" : "text-primary"
                }`}
              />
            </div>
            <DialogTitle className="text-base">{title}</DialogTitle>
          </div>
          {description && (
            <DialogDescription className="text-sm text-muted-foreground pl-[52px]">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="flex gap-3 mt-2">
          <Button
            variant="outline"
            className="flex-1"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button
            className={`flex-1 ${
              variant === "destructive"
                ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            }`}
            disabled={isLoading}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
