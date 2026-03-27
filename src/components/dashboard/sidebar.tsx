"use client"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Activity,
  FileText,
  Gamepad2,
  Gift,
  Zap,
} from "lucide-react"

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, active: true },
  { name: "Pulse", icon: Activity, active: false },
  { name: "Daily Brief", icon: FileText, active: false },
  { name: "Game Studio", icon: Gamepad2, active: false },
  { name: "Influencer Kit", icon: Gift, active: false },
]

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5C518]">
          <Zap className="h-5 w-5 text-[#0a0a0a]" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-foreground">
            Snapback
          </span>
          <span className="text-xs font-medium text-[#F5C518]">Intelligence</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <button
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  item.active
                    ? "bg-[#F5C518]/10 text-[#F5C518]"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    item.active ? "text-[#F5C518]" : "text-muted-foreground"
                  )}
                />
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-foreground">
            SB
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
              Snapback Team
            </span>
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
