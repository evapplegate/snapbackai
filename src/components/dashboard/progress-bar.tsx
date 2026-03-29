"use client"

import { Download, Target } from "lucide-react"

export function ProgressBar() {
  const currentDownloads = 100000
  const targetDownloads = 1000000
  const progress = (currentDownloads / targetDownloads) * 100

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
    return num.toString()
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F5C518]/10">
            <Target className="h-5 w-5 text-[#F5C518]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              100K → 1M Downloads
            </h2>
            <p className="text-sm text-muted-foreground">
              Track progress to the next milestone
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:text-right">
          <Download className="h-4 w-4 text-muted-foreground" />
          <span className="text-2xl font-bold text-[#F5C518]">
            {formatNumber(currentDownloads)}
          </span>
          <span className="text-muted-foreground">/</span>
          <span className="text-lg text-muted-foreground">
            {formatNumber(targetDownloads)}
          </span>
        </div>
      </div>

      <div className="relative h-4 overflow-hidden rounded-full bg-secondary">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#F5C518] to-[#f5d54a] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute left-[10%] top-0 h-full w-0.5 bg-border/50" />
        <div className="absolute left-[25%] top-0 h-full w-0.5 bg-border/50" />
        <div className="absolute left-[50%] top-0 h-full w-0.5 bg-border/50" />
        <div className="absolute left-[75%] top-0 h-full w-0.5 bg-border/50" />
      </div>

      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>100K</span>
        <span>250K</span>
        <span>500K</span>
        <span>750K</span>
        <span>1M</span>
      </div>
    </div>
  )
}