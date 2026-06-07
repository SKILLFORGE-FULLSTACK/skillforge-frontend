const stats = [
  { value: "94%", label: "SUCCESS RATE" },
  { value: "12k+", label: "MOCK INTERVIEWS" },
  { value: "450", label: "PARTNER COMPANIES" },
  { value: "3.5m", label: "COMMITS ANALYZED" }
]

export function StatsSection() {
  return (
    <section className="py-16 bg-card/50 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
