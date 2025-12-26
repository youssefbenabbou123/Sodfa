"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Package, ShoppingCart, TrendingUp, Clock, DollarSign } from "lucide-react"
import { motion } from "framer-motion"

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  })

  useEffect(() => {
    // Load stats from localStorage
    const products = JSON.parse(localStorage.getItem("products") || "[]")
    const orders = JSON.parse(localStorage.getItem("orders") || "[]")
    
    // Only count orders with status "livré" in revenue
    const totalRevenue = orders.reduce((sum: number, order: any) => {
      if (order.status === "livré") {
        return sum + (order.total || 0)
      }
      return sum
    }, 0)
    const pendingOrders = orders.filter((order: any) => order.status === "pending" || order.status === "En attente").length

    setStats({
      totalProducts: products.length || 8,
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders,
    })
  }, [])

  const statCards = [
    {
      label: "Revenus totaux",
      value: `${stats.totalRevenue.toFixed(2)} MAD`,
      icon: DollarSign,
      color: "bg-gradient-to-br from-green-500 to-emerald-600",
      description: "Chiffre d'affaires",
      href: "/admin/commandes",
    },
    {
      label: "Commandes",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "bg-gradient-to-br from-blue-500 to-indigo-600",
      description: "Total des commandes",
      href: "/admin/commandes",
    },
    {
      label: "Produits",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-gradient-to-br from-amber-500 to-orange-600",
      description: "En catalogue",
      href: "/admin/products",
    },
    {
      label: "En attente",
      value: stats.pendingOrders,
      icon: Clock,
      color: "bg-gradient-to-br from-red-500 to-rose-600",
      description: "Commandes en attente",
      href: "/admin/commandes",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-black text-[#d8bd78] mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre activité</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => router.push(stat.href)}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-[#d8bd78]/10 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg`}>
                  <Icon size={24} />
                </div>
              </div>
              <h3 className="text-3xl font-black text-[#d8bd78] mb-1">{stat.value}</h3>
              <p className="text-sm font-semibold text-foreground">{stat.label}</p>
              {stat.description && (
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-[#d8bd78]/10 shadow-lg"
      >
        <h3 className="text-xl font-semibold text-foreground mb-4">Bienvenue dans le panel d'administration</h3>
        <p className="text-muted-foreground">
          Gérez vos produits, commandes et suivez les statistiques de votre boutique depuis ce tableau de bord.
        </p>
      </motion.div>
    </div>
  )
}
