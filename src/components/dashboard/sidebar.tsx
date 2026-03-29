"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Activity, FileText, Gamepad2, Gift, Zap, CalendarRange, FlaskConical, X } from "lucide-react"

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "Pulse", icon: Activity, href: "/pulse" },
  { name: "Daily Brief", icon: FileText, href: "/brief" },
  { name: "Game Studio", icon: Gamepad2, href: "/generator" },
  { name: "Influencer Kit", icon: Gift, href: "/influencer" },
  { name: "Feature Lab", icon: FlaskConical, href: "/featurelab" },
  { name: "Campaign Planner", icon: CalendarRange, href: "/campaign" },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-sidebar transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5C518]">
              <Zap className="h-5 w-5 text-[#0a0a0a]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-foreground">Snapback</span>
              <span className="text-xs font-medium text-[#F5C518]">Intelligence</span>
            </div>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="md:hidden text-muted-foreground hover:text-foreground p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-[#F5C518]/10 text-[#F5C518]"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5",
                    pathname === item.href ? "text-[#F5C518]" : "text-muted-foreground"
                  )} />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-foreground">
              SB
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">Snapback Team</span>
              <span className="text-xs text-muted-foreground">Admin</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}