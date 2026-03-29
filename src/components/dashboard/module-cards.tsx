"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  Activity,
  FileText,
  Gamepad2,
  Gift,
  FlaskConical,
  ArrowRight,
  CalendarRange,
  Bell
} from "lucide-react"

const modules = [
  {
    name: "Pulse",
    description: "Real-time sports trend intelligence — see what's trending and how to act on it.",
    icon: Activity,
    color: "from-emerald-500/20 to-emerald-600/5",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    href: "/pulse",
  },
  {
    name: "Daily Brief",
    description: "AI-curated sports intelligence delivered fresh every morning for your team.",
    icon: FileText,
    color: "from-blue-500/20 to-blue-600/5",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    href: "/brief",
  },
  {
    name: "Game Studio",
    description: "Generate, review, and export complete trivia games from any topic in minutes.",
    icon: Gamepad2,
    color: "from-purple-500/20 to-purple-600/5",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-400",
    href: "/generator",
  },
  
  {
    name: "Feature Lab",
    description: "Generate, validate, and ship features that drive growth with AI product strategy.",
    icon: FlaskConical,
    color: "from-orange-500/20 to-orange-600/5",
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
    href: "/featurelab",
  },
  
  {
    name: "Influencer Kit",
    description: "Build custom challenge pages and outreach packages for any sports creator.",
    icon: Gift,
    color: "from-rose-500/20 to-rose-600/5",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-400",
    href: "/influencer",
  },

  {
    name: "Campaign Planner",
    description: "AI-generated week by week growth campaigns to hit your download target.",
    icon: CalendarRange,
    color: "from-teal-500/20 to-teal-600/5",
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-400",
    href: "/campaign",
  },

  {
  name: "Push Intelligence",
  description: "Generate high-converting push notifications tied to real sports moments with predicted open rates.",
  icon: Bell,
  color: "from-yellow-500/20 to-yellow-600/5",
  iconBg: "bg-yellow-500/10",
  iconColor: "text-yellow-400",
  href: "/push",
  },
]

export function ModuleCards() {
  const router = useRouter()

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {modules.map((module) => (
        <div
          key={module.name}
          className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-[#F5C518]/30 hover:shadow-lg hover:shadow-[#F5C518]/5"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 transition-opacity group-hover:opacity-100`}
          />

          <div className="relative flex flex-col gap-4 p-5">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${module.iconBg}`}>
              <module.icon className={`h-6 w-6 ${module.iconColor}`} />
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg font-bold text-foreground">{module.name}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {module.description}
              </p>
            </div>

            <Button
              onClick={() => router.push(module.href)}
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