"use client";

import { Search, Globe, Moon, Bell, Grid3X3, Check, CheckCheck } from "lucide-react";
import { useNotifications, useMarkRead, useMarkAllRead } from "@/lib/hooks/useNotifications";
import { useAuthStore } from "@/lib/stores/authStore";
import { useState, useRef, useEffect } from "react";

interface DashboardHeaderProps {
  showSearch?: boolean;
}

export function DashboardHeader({ showSearch = true }: DashboardHeaderProps) {
  const user = useAuthStore((s) => s.user);
  const { data: notifData } = useNotifications();
  const { mutate: markRead } = useMarkRead();
  const { mutate: markAllRead } = useMarkAllRead();
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifData?.unread_count ?? 0;
  const notifications = notifData?.notifications ?? [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
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
              placeholder="Rechercher des défis, certifications, mentors..."
              className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        {/* Theme toggle */}
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <Moon className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* User level badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary">
          <span className="text-xs text-muted-foreground">LV.{user?.level ?? 1}</span>
          <span className="text-xs text-primary font-medium">
            {user?.xp_total?.toLocaleString() ?? 0} XP
          </span>
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            {user?.name?.charAt(0) ?? "?"}
          </div>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifs((v) => !v)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors relative">
            <Bell className="w-4 h-4 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 flex items-center justify-center bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full px-1">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="font-semibold text-foreground text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllRead()}
                    className="flex items-center gap-1 text-xs text-primary hover:underline">
                    <CheckCheck className="w-3 h-3" />
                    Tout marquer lu
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Aucune notification
                  </div>
                ) : (
                  notifications.slice(0, 10).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => !n.read_at && markRead(n.id)}
                      className={`px-4 py-3 border-b border-border/50 cursor-pointer hover:bg-secondary/50 transition-colors ${
                        !n.read_at ? "bg-primary/5" : ""
                      }`}>
                      <div className="flex items-start gap-2">
                        {!n.read_at && (
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{n.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {n.body}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(n.created_at).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Apps grid */}
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <Grid3X3 className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
