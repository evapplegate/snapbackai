"use client"

import { Button } from "@/components/ui/button"
import {
  Activity,
  FileText,
  Gamepad2,
  Gift,
  BarChart3,
  ArrowRight,
} from "lucide-react"

const modules = [
  {
    name: "Pulse",
    description:
      "Real-time social listening and sentiment analysis across sports conversations.",
    icon: Activity,
    color: "from-emerald-500/20 to-emerald-600/5",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
  },
  {
    name: "Daily Brief",
    description:
      "AI-curated sports news digest delivered fresh every morning for your team.",
    icon: FileText,
    color: "from-blue-500/20 to-blue-600/5",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
  },
  {
    name: "Game Studio",
    description:
      "Interactive prediction games and engagement tools for your audience.",
    icon: Gamepad2,
    color: "from-purple-500/20 to-purple-600/5",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-400",
  },
  {
    name: "Influencer Kit",
    description:
      "Curated content packages and assets for sports influencer partnerships.",
    icon: Gift,
    color: "from-rose-500/20 to-rose-600/5",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-400",
  },
  {
    name: "Analytics",
    description:
      "Deep performance metrics and insights across all Snapback modules.",
    icon: BarChart3,
    color: "from-[#F5C518]/20 to-[#F5C518]/5",
    iconBg: "bg-[#F5C518]/10",
    iconColor: "text-[#F5C518]",
  },
]

export function ModuleCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {modules.map((module) => (
        <div
          key={module.name}
          className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-[#F5C518]/30 hover:shadow-lg hover:shadow-[#F5C518]/5"
        >
          {/* Gradient background */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 transition-opacity group-hover:opacity-100`}
          />

          <div className="relative flex flex-col gap-4 p-5">
            {/* Icon */}
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${module.iconBg}`}
            >
              <module.icon className={`h-6 w-6 ${module.iconColor}`} />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg font-bold text-foreground">{module.name}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {module.description}
              </p>
            </div>

            {/* Launch Button */}
            <Button
              className="mt-2 w-full justify-between bg-secondary text-foreground hover:bg-[#F5C518] hover:text-[#0a0a0a]"
              variant="secondary"
            >
              Launch
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
