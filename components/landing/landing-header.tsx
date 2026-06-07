"use client"

import Link from "next/link"
import { Menu, X, Sun, Moon, Globe } from "lucide-react"
import { useState } from "react"
import { Logo } from "@/components/skillforge"

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Logo href="/" />
            <div className="hidden md:flex items-center gap-6">
              <Link href="#solutions" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Solutions
              </Link>
              <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="#enterprise" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Enterprise
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-secondary text-xs">
              <span className="text-muted-foreground">FR</span>
              <span className="text-foreground font-medium bg-card px-1.5 py-0.5 rounded">EN</span>
            </div>
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
              <Sun className="w-4 h-4 text-muted-foreground" />
            </button>
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/dashboard" className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Demo
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link href="#solutions" className="text-sm font-medium text-foreground">Solutions</Link>
              <Link href="#pricing" className="text-sm font-medium text-muted-foreground">Pricing</Link>
              <Link href="#enterprise" className="text-sm font-medium text-muted-foreground">Enterprise</Link>
              <hr className="border-border" />
              <Link href="/login" className="text-sm font-medium text-muted-foreground">Sign In</Link>
              <Link href="/dashboard" className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg text-center">
                Demo
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
