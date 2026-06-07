import { DashboardHeader, DashboardContent } from "@/components/dashboard"

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader />
      <main className="flex-1 overflow-auto">
        <DashboardContent />
      </main>
    </>
  )
}
