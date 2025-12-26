"use client"

import { getCurrentUser } from "@/lib/auth"
import { useEffect, useState } from "react"
import type { User } from "@/lib/auth"

export default function AdminHeader() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-[#d8bd78]/10 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-2xl font-bold text-[#d8bd78]">Panel d'Administration</h1>
        <div className="flex-1 md:flex-none"></div>
        {user && (
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{user.username}</p>
              <p className="text-xs text-muted-foreground">Administrateur</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d8bd78] to-[#b8a568] flex items-center justify-center shadow-lg">
              <span className="text-white font-semibold text-sm">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
