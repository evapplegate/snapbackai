"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Flame } from "lucide-react"

interface Trend {
  sport: string
  headline: string
  relevanceScore: number
  triviaAngles: string[]
  suggestedAction: string
}

export function TrendingFeed() {
  const [trends, setTrends] = useState<Trend[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  const fetchTrends = async () => {
    try {
      const res = await fetch("/api/pulse")
      const data = await res.json()
      setTrends(data.trends || [])
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrends()
  }, [])

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5C518]/10">
            <Flame className="h-5 w-5 text-[#F5C518]" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Trending Sports Topics</h3>
            <p className="text-xs text-muted-foreground">
              {lastUpdated ? `Last updated ${lastUpdated}` : "Loading live trends..."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1">
          <span className={`h-2 w-2 rounded-full ${loading ? "bg-yellow-400" : "bg-emerald-400 animate-pulse"}`} />
          <span className={`text-xs font-medium ${loading ? "text-yellow-400" : "text-emerald-400"}`}>
            {loading ? "Fetching..." : "Live"}
          </span>
        </div>
      </div>

      <div className="divide-y divide-border">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <div className="h-8 w-8 rounded-lg bg-secondary animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 rounded bg-secondary animate-pulse" />
                <div className="h-3 w-32 rounded bg-secondary animate-pulse" />
              </div>
            </div>
          ))
        ) : (
          trends.slice(0, 3).map((trend, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-secondary/50"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-bold text-muted-foreground">
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground truncate">{trend.headline}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{trend.sport}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-xs bg-[#F5C518]/10 text-[#F5C518] px-2 py-1 rounded font-medium">
                  {trend.relevanceScore}/10
                </span>
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}