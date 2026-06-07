"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/skillforge";
import {
  LayoutDashboard,
  MessageSquare,
  Award,
  Users,
  Settings,
  HelpCircle,
  Plus,
  Trophy,
  TrendingUp,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { name: "Interviews", href: "/dashboard/interviews", icon: MessageSquare },
  { name: "Certifications", href: "/dashboard/certifications", icon: Award },
  { name: "Progression", href: "/dashboard/progress", icon: TrendingUp },
  { name: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
  { name: "Forum", href: "/dashboard/forum", icon: Users },
];

const bottomNav = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Support", href: "/dashboard/support", icon: HelpCircle },
];

export function DeveloperSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-56 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <Logo href="/dashboard" showSubtitle subtitle="Engineering Hub" />
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-auto">
        {navigation.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
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

      {/* New Interview Button */}
      <div className="px-3 pb-2">
        <Link
          href="/dashboard/interviews"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          New Interview
        </Link>
      </div>

      {/* Bottom Navigation */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        {bottomNav.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <item.icon className="w-5 h-5" />
            {item.name}
          </Link>
        ))}
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-destructive transition-colors">
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
