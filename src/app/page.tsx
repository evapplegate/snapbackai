"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { ProgressBar } from "@/components/dashboard/progress-bar"
import { ModuleCards } from "@/components/dashboard/module-cards"
import { TrendingFeed } from "@/components/dashboard/trending-feed"
import { Menu } from "lucide-react"

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="md:ml-64 min-h-screen">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-4 md:px-8">
            <div className="flex items-center gap-3">
              {/* Hamburger — mobile only */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden text-muted-foreground hover:text-foreground p-1"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Welcome back to Snapback Intelligence
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-sm text-muted-foreground hidden sm:block">
                  All systems operational
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-8 p-4 md:p-8">
          <section>
            <ProgressBar />
          </section>

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

          <section>
            <TrendingFeed />
          </section>
        </div>
      </main>
    </div>
  )
}