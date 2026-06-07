import Link from "next/link"

export function LandingHero() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">ENGINEERING-GRADE EXCELLENCE</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            SkillForge: Prepare. Certify. Get Hired.
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            La plateforme qui prépare les développeurs aux entretiens et certifie leurs compétences par la preuve réelle.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link 
              href="/dashboard" 
              className="w-full sm:w-auto px-8 py-3 text-base font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              {"Commencer l'entraînement"}
            </Link>
            <Link 
              href="/certifications" 
              className="w-full sm:w-auto px-8 py-3 text-base font-medium border border-border text-foreground rounded-lg hover:bg-secondary transition-colors"
            >
              Voir les certifications
            </Link>
          </div>

          {/* Dashboard Preview */}
          <div className="relative rounded-xl overflow-hidden border border-border shadow-2xl shadow-primary/5">
            <div className="aspect-video bg-card">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function DashboardPreview() {
  return (
    <div className="w-full h-full bg-[#0d1117] p-4 lg:p-8">
      <div className="flex h-full">
        {/* Sidebar mock */}
        <div className="hidden lg:block w-48 bg-[#161b22] rounded-lg p-4 mr-4">
          <div className="space-y-3">
            <div className="h-3 w-20 bg-primary/30 rounded" />
            <div className="space-y-2 pt-4">
              <div className="h-8 bg-primary/20 rounded flex items-center px-2">
                <div className="w-4 h-4 bg-primary rounded mr-2" />
                <div className="h-2 w-16 bg-primary/40 rounded" />
              </div>
              <div className="h-8 bg-transparent rounded flex items-center px-2">
                <div className="w-4 h-4 bg-muted rounded mr-2" />
                <div className="h-2 w-20 bg-muted/40 rounded" />
              </div>
              <div className="h-8 bg-transparent rounded flex items-center px-2">
                <div className="w-4 h-4 bg-muted rounded mr-2" />
                <div className="h-2 w-14 bg-muted/40 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Main content mock */}
        <div className="flex-1 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 bg-[#161b22] rounded-lg p-4 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-primary flex items-center justify-center">
                <span className="text-2xl font-bold text-foreground">850</span>
              </div>
            </div>
            <div className="flex-1 bg-[#161b22] rounded-lg p-4">
              <div className="h-3 w-20 bg-accent/30 rounded mb-2" />
              <div className="h-4 w-32 bg-foreground/20 rounded mb-4" />
              <div className="h-2 w-full bg-primary/30 rounded-full">
                <div className="h-2 w-2/3 bg-primary rounded-full" />
              </div>
            </div>
          </div>
          <div className="bg-[#161b22] rounded-lg p-4 h-32">
            <div className="h-3 w-32 bg-foreground/20 rounded mb-4" />
            <div className="grid grid-cols-26 gap-0.5">
              {Array.from({ length: 130 }).map((_, i) => (
                <div 
                  key={i} 
                  className="w-2 h-2 rounded-sm"
                  style={{ 
                    backgroundColor: Math.random() > 0.6 
                      ? `rgba(99, 102, 241, ${0.2 + Math.random() * 0.8})` 
                      : 'rgba(55, 65, 81, 0.3)' 
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
