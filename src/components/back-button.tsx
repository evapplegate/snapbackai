"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push("/")}
      className="flex items-center gap-2 text-[#F5C518] hover:text-yellow-400 transition mb-6 group"
    >
      <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
      <span className="text-sm font-medium">Dashboard</span>
    </button>
  )
}