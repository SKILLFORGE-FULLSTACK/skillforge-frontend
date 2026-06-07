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

const navigation = [
  { name: "Dashboard", href: "/recruiter", icon: LayoutDashboard, exact: true },
  { name: "Marketplace", href: "/recruiter/marketplace", icon: Users },
  { name: "Pipeline", href: "/recruiter/pipeline", icon: Layers },
  { name: "Offres d'emploi", href: "/recruiter/jobs", icon: Briefcase },
  { name: "Favoris", href: "/recruiter/saved", icon: Star },
];

const bottomNav = [{ name: "Support", href: "/recruiter/support", icon: HelpCircle }];

export function RecruiterSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <aside className="w-56 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
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

      {/* Post New Role Button */}
      <div className="px-3 pb-2">
        <Link
          href="/recruiter"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Post New Role
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
