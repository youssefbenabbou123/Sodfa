"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated, isAdmin } from "@/lib/auth"
import Sidebar from "@/components/admin/Sidebar"
import AdminHeader from "@/components/admin/AdminHeader"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/admin/login") {
      setLoading(false)
      setIsAuthorized(false)
      return
    }

    // Only check on client side
    if (typeof window === "undefined") {
      setLoading(false)
      return
    }

    const checkAuth = () => {
      const authenticated = isAuthenticated()
      const admin = isAdmin()
      
      if (!authenticated || !admin) {
        router.push("/admin/login")
        setLoading(false)
        return
      }
      
      setIsAuthorized(true)
      setLoading(false)
    }

    // Small delay to ensure everything is ready
    const timer = setTimeout(checkAuth, 100)
    return () => clearTimeout(timer)
  }, [router, pathname])

  // Don't apply layout to login page
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-[#d8bd78] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:ml-64">
        <AdminHeader />
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
