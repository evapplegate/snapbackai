import { Sidebar } from "@/components/dashboard/sidebar"
import { ProgressBar } from "@/components/dashboard/progress-bar"
import { ModuleCards } from "@/components/dashboard/module-cards"
import { TrendingFeed } from "@/components/dashboard/trending-feed"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-8">
            <div>
              <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back to Snapback Intelligence
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-sm text-muted-foreground">
                  All systems operational
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex flex-col gap-8 p-8">
          {/* Progress Bar Section */}
          <section>
            <ProgressBar />
          </section>

          {/* Module Cards Section */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">Modules</h2>
                <p className="text-sm text-muted-foreground">
                  Access your intelligence tools
                </p>
              </div>
            </div>
            <ModuleCards />
          </section>

          {/* Trending Feed Section */}
          <section>
            <TrendingFeed />
          </section>
        </div>
      </main>
    </div>
  )
}
