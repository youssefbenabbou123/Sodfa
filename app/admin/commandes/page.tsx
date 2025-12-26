"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Search, Eye, CheckCircle, XCircle, Clock, ChevronDown } from "lucide-react"
import { createPortal } from "react-dom"
import Toast from "@/components/toast"

interface Order {
  id: string
  customerName: string
  phone: string
  city: string
  address: string
  items: Array<{ id: string; name: string; price: number; quantity: number; image: string }>
  total: number
  status: "pending" | "confirmed" | "livré" | "cancelled"
  date: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  pending: { label: "En attente", color: "#f59e0b", bgColor: "#fef3c7" },
  confirmed: { label: "Confirmée", color: "#10b981", bgColor: "#d1fae5" },
  livré: { label: "Livré", color: "#059669", bgColor: "#d1fae5" },
  cancelled: { label: "Annulée", color: "#ef4444", bgColor: "#fee2e2" },
}

const ORDER_STATUSES = ["pending", "confirmed", "livré", "cancelled"] as const

export default function AdminCommandes() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [openStatusDropdown, setOpenStatusDropdown] = useState<string | null>(null)
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null)
  const statusButtonRefs = useState<Record<string, HTMLButtonElement | null>>({})[0]
  const [filters, setFilters] = useState({
    status: "",
    search: "",
  })
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders")
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }
  }, [])

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    const order = orders.find((o) => o.id === orderId)
    const updated = orders.map((order) =>
      order.id === orderId ? { ...order, status } : order
    )
    setOrders(updated)
    localStorage.setItem("orders", JSON.stringify(updated))
    setOpenStatusDropdown(null)
    setDropdownPosition(null)
    
    // Show toast message
    if (status === "livré") {
      setToast({ 
        message: `Commande marquée comme livrée. ${order?.total.toFixed(2)} MAD ajoutés aux revenus.`, 
        type: "success" 
      })
    } else {
      setToast({ 
        message: `Statut de la commande mis à jour: ${STATUS_CONFIG[status]?.label}`, 
        type: "success" 
      })
    }
  }

  const handleOpenDropdown = (orderId: string, button: HTMLButtonElement) => {
    const rect = button.getBoundingClientRect()
    setDropdownPosition({
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
    })
    setOpenStatusDropdown(orderId)
  }

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filters.status === "" || order.status === filters.status
    const matchesSearch =
      filters.search === "" ||
      order.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
      order.id.toLowerCase().includes(filters.search.toLowerCase()) ||
      order.phone.includes(filters.search)
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-black text-[#d8bd78] mb-2">Commandes</h1>
        <p className="text-muted-foreground">Gérez les commandes en ligne</p>
      </motion.div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-[#d8bd78]/10 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#d8bd78] mb-2">Recherche</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Nom, téléphone, ID..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-[#d8bd78]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d8bd78]/20"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#d8bd78] mb-2">Statut</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2 border border-[#d8bd78]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d8bd78]/20"
            >
              <option value="">Tous</option>
              {ORDER_STATUSES.map((status) => {
                const config = STATUS_CONFIG[status]
                return (
                  <option key={status} value={status}>
                    {config.label}
                  </option>
                )
              })}
            </select>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-muted-foreground">
              {filteredOrders.length} commande{filteredOrders.length > 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#d8bd78]/10 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#d8bd78]/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#d8bd78]">ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#d8bd78]">Client</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#d8bd78]">Total</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#d8bd78]">Statut</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#d8bd78]">Date</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#d8bd78]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d8bd78]/10">
              {filteredOrders.map((order) => {
                const statusConfig = STATUS_CONFIG[order.status]
                return (
                  <tr key={order.id} className="hover:bg-[#d8bd78]/5 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground font-mono">
                      {order.id.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      <div>{order.customerName}</div>
                      <div className="text-xs text-muted-foreground">{order.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-[#d8bd78]">
                      {order.total.toFixed(2)} MAD
                    </td>
                    <td className="px-6 py-4">
                      <button
                        ref={(el) => {
                          if (el) statusButtonRefs[order.id] = el
                        }}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (openStatusDropdown === order.id) {
                            setOpenStatusDropdown(null)
                            setDropdownPosition(null)
                          } else if (e.currentTarget) {
                            handleOpenDropdown(order.id, e.currentTarget)
                          }
                        }}
                        className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full font-medium transition-all hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2"
                        style={{
                          color: statusConfig.color,
                          backgroundColor: statusConfig.bgColor,
                          border: `1px solid ${statusConfig.color}40`,
                        }}
                      >
                        <span>{statusConfig.label}</span>
                        <ChevronDown
                          size={14}
                          className={`transition-transform ${openStatusDropdown === order.id ? "rotate-180" : ""}`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(order.date).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-[#d8bd78] hover:bg-[#d8bd78]/10 rounded-lg transition-colors"
                        title="Voir détails"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            Aucune commande trouvée
          </div>
        )}
      </div>

      {/* Status Dropdown Portal */}
      {openStatusDropdown && dropdownPosition && typeof window !== "undefined" &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[9999]"
              onClick={() => {
                setOpenStatusDropdown(null)
                setDropdownPosition(null)
              }}
            />
            <div
              className="fixed z-[10000] bg-white rounded-lg shadow-xl border border-[#d8bd78]/20 py-1 w-[180px] max-h-[300px] overflow-y-auto overflow-x-hidden"
              onClick={(e) => e.stopPropagation()}
              style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
              }}
            >
              {ORDER_STATUSES.map((status) => {
                const config = STATUS_CONFIG[status]
                const order = orders.find((o) => o.id === openStatusDropdown)
                const isSelected = status === order?.status
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (openStatusDropdown && status !== order?.status) {
                        updateOrderStatus(openStatusDropdown, status)
                      }
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                    style={{
                      color: config.color,
                      backgroundColor: isSelected ? config.bgColor : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = config.bgColor + "80"
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = "transparent"
                      }
                    }}
                  >
                    <span>{config.label}</span>
                    {isSelected && <span className="ml-auto text-xs font-bold">✓</span>}
                  </button>
                )
              })}
            </div>
          </>,
          document.body
        )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#d8bd78]">
                Commande #{selectedOrder.id.substring(0, 8)}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-muted-foreground hover:text-[#d8bd78] text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-[#d8bd78] mb-2">Client</h3>
                <p className="text-foreground">{selectedOrder.customerName}</p>
                <p className="text-sm text-muted-foreground">Téléphone: {selectedOrder.phone}</p>
                <p className="text-sm text-muted-foreground">Ville: {selectedOrder.city}</p>
                <p className="text-sm text-muted-foreground">Adresse: {selectedOrder.address}</p>
              </div>
              {selectedOrder.items && (
                <div>
                  <h3 className="font-bold text-[#d8bd78] mb-2">Articles</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <span className="text-foreground">{item.name}</span>
                            <div className="text-xs text-muted-foreground">
                              Quantité: {item.quantity}
                            </div>
                          </div>
                        </div>
                        <span className="font-bold text-[#d8bd78]">
                          {(item.price * item.quantity).toFixed(2)} MAD
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-[#d8bd78]">{selectedOrder.total.toFixed(2)} MAD</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
