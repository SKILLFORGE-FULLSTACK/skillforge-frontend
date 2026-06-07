import { RecruiterSidebar, RecruiterHeader } from "@/components/recruiter"

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <RecruiterSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <RecruiterHeader />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
