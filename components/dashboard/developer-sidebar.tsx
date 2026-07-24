"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/skillforge";
import {
  LayoutDashboard,
  MessageSquare,
  Award,
  Settings,
  HelpCircle,
  Plus,
  Trophy,
  TrendingUp,
  LogOut,
  Users,
  Briefcase,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useT } from "@/lib/i18n/useTranslation";

export function DeveloperSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { t } = useT();

  const navigation = [
    { name: t("sidebar.dashboard"), href: "/dashboard", icon: LayoutDashboard, exact: true },
    { name: t("sidebar.interviews"), href: "/dashboard/interviews", icon: MessageSquare },
    { name: t("sidebar.jobs"), href: "/dashboard/jobs", icon: Briefcase },
    { name: t("sidebar.certifications"), href: "/dashboard/certifications", icon: Award },
    { name: t("sidebar.progression"), href: "/dashboard/progress", icon: TrendingUp },
    { name: t("sidebar.leaderboard"), href: "/dashboard/leaderboard", icon: Trophy },
    { name: t("sidebar.forum"), href: "/dashboard/forum", icon: Users },
    ...(user?.role === "admin"
      ? [{ name: t("sidebar.admin"), href: "/dashboard/admin/interview-categories", icon: ShieldCheck }]
      : []),
  ];

  const bottomNav = [
    { name: t("sidebar.settings"), href: "/dashboard/settings", icon: Settings },
    { name: t("sidebar.support"), href: "/dashboard/support", icon: HelpCircle },
  ];

  return (
    <aside className="w-56 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <Logo href="/dashboard" showSubtitle subtitle="E-Hub" />
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
          href="/dashboard/interviews"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          {t("sidebar.newInterview")}
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
