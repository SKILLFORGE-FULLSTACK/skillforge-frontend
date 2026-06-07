import { 
  LandingHeader, 
  LandingHero, 
  TechStack, 
  FeaturesSection, 
  StatsSection, 
  LandingFooter 
} from "@/components/landing"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero />
        <TechStack />
        <FeaturesSection />
        <StatsSection />
      </main>
      <LandingFooter />
    </div>
  )
}
