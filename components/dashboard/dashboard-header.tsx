"use client";

import { Search, Bell, CheckCheck, LogOut, User, TrendingUp, Settings } from "lucide-react";
import { useNotifications, useMarkRead, useMarkAllRead } from "@/lib/hooks/useNotifications";
import { useAuthStore } from "@/lib/stores/authStore";
import { useAuth } from "@/lib/hooks/useAuth";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useT } from "@/lib/i18n/useTranslation";
import { LocaleToggle } from "@/components/ui/locale-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface DashboardHeaderProps {
  showSearch?: boolean;
}

export function DashboardHeader({ showSearch = true }: DashboardHeaderProps) {
  const user = useAuthStore((s) => s.user);
  const { logout } = useAuth();
  const { data: notifData } = useNotifications();
  const { mutate: markRead } = useMarkRead();
  const { mutate: markAllRead } = useMarkAllRead();
  const { t, locale, setLocale, tDate } = useT();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifData?.unread_count ?? 0;
  const notifications = notifData?.notifications ?? [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="h-16 border-b border-border bg-background px-6 flex items-center justify-between">
      {/* Search */}
      {showSearch && (
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("header.searchPlaceholder")}
              className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">
        <LocaleToggle />

        <ThemeToggle />

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotifs((v) => !v); setShowUserMenu(false); }}
            className="p-2 rounded-lg hover:bg-secondary transition-colors relative">
            <Bell className="w-4 h-4 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 flex items-center justify-center bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full px-1">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="font-semibold text-foreground text-sm">{t("header.notifications")}</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllRead()}
                    className="flex items-center gap-1 text-xs text-primary hover:underline">
                    <CheckCheck className="w-3 h-3" />
                    {t("header.markAllRead")}
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    {t("header.noNotifications")}
                  </div>
                ) : (
                  notifications.slice(0, 10).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => !n.read_at && markRead(n.id)}
                      className={`px-4 py-3 border-b border-border/50 cursor-pointer hover:bg-secondary/50 transition-colors ${!n.read_at ? "bg-primary/5" : ""}`}>
                      <div className="flex items-start gap-2">
                        {!n.read_at && (
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{n.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
                          <p className="text-xs text-muted-foreground mt-1">{tDate(n.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User avatar + dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => { setShowUserMenu((v) => !v); setShowNotifs(false); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-secondary transition-colors">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-primary font-medium leading-none">
                LV.{user?.level ?? 1}
              </span>
              <span className="text-[10px] text-muted-foreground leading-none mt-0.5">
                {user?.xp_total?.toLocaleString() ?? 0} XP
              </span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm select-none">
              {user?.name?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold text-foreground truncate">{user?.name ?? "Utilisateur"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 bg-primary/20 text-primary rounded font-medium capitalize">
                  {user?.plan ?? "free"}
                </span>
              </div>
              <div className="py-1">
                <Link
                  href="/dashboard"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors">
                  <User className="w-4 h-4 text-muted-foreground" />
                  {t("header.profile")}
                </Link>
                <Link
                  href="/dashboard/progress"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  {t("header.myProgress")}
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  {t("header.settings")}
                </Link>
              </div>
              <div className="border-t border-border py-1">
                <button
                  onClick={() => { setShowUserMenu(false); setShowLogoutConfirm(true); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                  <LogOut className="w-4 h-4" />
                  {t("header.logout")}
                </button>
              </div>
            </div>
          )}
        </div>
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
    </header>
  );
}
