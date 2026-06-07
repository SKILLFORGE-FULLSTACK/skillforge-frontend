"use client"

import { Search, Bell, Settings } from "lucide-react"
import { Logo } from "@/components/skillforge"
import Link from "next/link"

const navItems = [
  { name: "Marketplace", href: "/recruiter" },
  { name: "Pipeline", href: "/recruiter/pipeline" },
  { name: "Messages", href: "/recruiter/messages" },
  { name: "Analytics", href: "/recruiter/analytics" },
]

export function RecruiterHeader() {
  return (
    <header className="h-16 border-b border-border bg-background px-6 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Logo href="/recruiter" />
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden lg:block relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search talent..."
            className="w-64 pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Settings */}
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent" />
      </div>
    </header>
  )
}
