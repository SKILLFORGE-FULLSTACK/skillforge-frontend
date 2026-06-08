"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users,
  Layers,
  Briefcase,
  Star,
  Plus,
  HelpCircle,
  CheckCircle,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useT } from "@/lib/i18n/useTranslation";

export function RecruiterSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { t, locale } = useT();

  const navigation = [
    { name: "Dashboard", href: "/recruiter", icon: LayoutDashboard, exact: true },
    { name: "Marketplace", href: "/recruiter/marketplace", icon: Users },
    { name: "Pipeline", href: "/recruiter/pipeline", icon: Layers },
    { name: locale === "fr" ? "Offres d'emploi" : "Job Offers", href: "/recruiter/jobs", icon: Briefcase },
    { name: locale === "fr" ? "Favoris" : "Saved", href: "/recruiter/saved", icon: Star },
  ];

  const bottomNav = [
    { name: t("sidebar.support"), href: "/recruiter/support", icon: HelpCircle },
  ];

  return (
    <aside className="w-56 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="font-semibold text-foreground text-sm truncate">
              {user?.name ?? "Recruiter"}
            </div>
            <div className="text-xs text-muted-foreground">Recruiter Dashboard</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-auto">
        {navigation.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}>
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-2">
        <Link
          href="/recruiter"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          {locale === "fr" ? "Nouveau poste" : "Post New Role"}
        </Link>
      </div>

      <div className="p-3 border-t border-sidebar-border space-y-1">
        {bottomNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <item.icon className="w-5 h-5" />
            {item.name}
          </Link>
        ))}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-destructive transition-colors">
          <LogOut className="w-5 h-5" />
          {t("sidebar.logout")}
        </button>
      </div>

      <ConfirmDialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        title={t("header.confirmLogout")}
        description={t("header.confirmLogoutDesc")}
        confirmLabel={t("header.doLogout")}
        cancelLabel={t("header.cancel")}
        variant="destructive"
        onConfirm={logout}
      />
    </aside>
  );
}
