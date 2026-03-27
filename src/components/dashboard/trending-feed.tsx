"use client"

import { TrendingUp, MessageCircle, Flame, Clock } from "lucide-react"

const trendingTopics = [
  {
    id: 1,
    topic: "NBA Playoffs",
    subtitle: "Lakers vs Nuggets Game 5",
    mentions: "124K",
    sentiment: "positive",
    timeAgo: "2m ago",
    change: "+18%",
  },
  {
    id: 2,
    topic: "NFL Draft",
    subtitle: "Top QB prospects heating up",
    mentions: "89K",
    sentiment: "neutral",
    timeAgo: "5m ago",
    change: "+32%",
  },
  {
    id: 3,
    topic: "Champions League",
    subtitle: "Semi-finals matchups announced",
    mentions: "156K",
    sentiment: "positive",
    timeAgo: "8m ago",
    change: "+45%",
  },
]

export function TrendingFeed() {
  return (
    <div className="rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5C518]/10">
            <Flame className="h-5 w-5 text-[#F5C518]" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Trending Sports Topics</h3>
            <p className="text-xs text-muted-foreground">
              Live feed • Updated every 30 seconds
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Live</span>
        </div>
      </div>

      {/* Topics List */}
      <div className="divide-y divide-border">
        {trendingTopics.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-secondary/50"
          >
            {/* Rank */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-bold text-muted-foreground">
              {index + 1}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground">{item.topic}</h4>
                <span className="rounded bg-[#F5C518]/10 px-1.5 py-0.5 text-xs font-medium text-[#F5C518]">
                  {item.change}
                </span>
              </div>
              <p className="truncate text-sm text-muted-foreground">
                {item.subtitle}
              </p>
            </div>

            {/* Stats */}
            <div className="flex shrink-0 items-center gap-4">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm font-medium">{item.mentions}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-xs">{item.timeAgo}</span>
              </div>
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
