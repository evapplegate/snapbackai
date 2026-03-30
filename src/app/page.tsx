"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { ProgressBar } from "@/components/dashboard/progress-bar"
import { ModuleCards } from "@/components/dashboard/module-cards"
import { TrendingFeed } from "@/components/dashboard/trending-feed"
import { Menu, X, Zap } from "lucide-react"

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="md:ml-64 min-h-screen">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-4 md:px-8">
            <div className="flex items-center gap-3">
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

        {/* Budget protection banner */}
        {!bannerDismissed && (
          <div className="bg-[#F5C518]/10 border-b border-[#F5C518]/30 px-4 md:px-8 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5C518]/20">
                  <Zap className="h-5 w-5 text-[#F5C518]" />
                </div>
                <div>
                  <p className="text-base font-bold text-white mb-1">
                    👋 Welcome — use ⚡ Demo mode to explore every module instantly
                  </p>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Every module has a <span className="text-[#F5C518] font-medium">⚡ Demo</span> button that loads a fully pre-built, high-quality example output with zero wait time and zero API cost. Live AI generation is available on all modules too, however it costs money to generate and I am broke. If you choose to run the actual module, please only do so once or twice. Thank you! — Demo is the fastest way to see what Snapback Intelligence can do.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setBannerDismissed(true)}
                className="text-zinc-500 hover:text-zinc-300 transition shrink-0 p-1 mt-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

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