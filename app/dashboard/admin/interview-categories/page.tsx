"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import {
  AdminInterviewCategoriesContent,
  DashboardHeader,
} from "@/components/dashboard";
import { useAuthStore } from "@/lib/stores/authStore";
import { useT } from "@/lib/i18n/useTranslation";

export default function AdminInterviewCategoriesPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const { t } = useT();

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (user && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [user, isAdmin, router]);

  if (!isAdmin) {
    return (
      <>
        <DashboardHeader />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <ShieldAlert className="w-10 h-10" />
            <p>{t("admin.accessDenied")}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader />
      <AdminInterviewCategoriesContent />
    </>
  );
}
