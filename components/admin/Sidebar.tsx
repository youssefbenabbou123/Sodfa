"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, LogOut, Menu, X } from "lucide-react"
import { logout } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  const menuItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/products",
      label: "Produits",
      icon: Package,
    },
    {
      href: "/admin/commandes",
      label: "Commandes",
      icon: ShoppingCart,
    },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#d8bd78] text-white rounded-lg shadow-lg"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 h-screen w-64 bg-white/80 backdrop-blur-xl border-r border-[#d8bd78]/10 z-40 lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full p-6 pt-4">
          {/* Logo */}
          <div className="mb-8">
            <Link href="/admin" className="flex items-center justify-center">
              <Image
                src="/company-removebg-preview.png"
                alt="SODFA"
                width={150}
                height={75}
                className="object-contain brightness-110 contrast-110 drop-shadow-lg h-20 w-auto"
                priority
              />
            </Link>
            <h2 className="text-xl font-semibold mt-4 text-center text-[#d8bd78]">Admin Panel</h2>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive =
                pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    isActive
                      ? "bg-[#d8bd78] text-white shadow-lg shadow-[#d8bd78]/20"
                      : "text-foreground hover:bg-[#d8bd78]/5 hover:text-[#d8bd78]"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={20} className={isActive ? "text-white" : ""} />
                  </motion.div>
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-2 w-2 h-2 bg-white rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Logout Button */}
          <div className="mt-8">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}
