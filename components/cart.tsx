"use client"

import { useState } from "react"
import { X, Trash2 } from "lucide-react"
import Toast from "./toast"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartProps {
  items: CartItem[]
  onRemove: (productId: string) => void
  onUpdateQuantity: (productId: string, quantity: number) => void
  onClose: () => void
  onClearCart?: () => void
}

export default function Cart({ items, onRemove, onUpdateQuantity, onClose, onClearCart }: CartProps) {
  const [showCheckout, setShowCheckout] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
  })

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Save order to localStorage
    const order = {
      id: Date.now().toString(),
      customerName: formData.fullName,
      phone: formData.phone,
      city: formData.city,
      address: formData.address,
      items: items,
      total: total,
      status: "pending",
      date: new Date().toISOString(),
    }

    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    existingOrders.push(order)
    localStorage.setItem("orders", JSON.stringify(existingOrders))

    // Show success toast
    setShowToast(true)
    setShowCheckout(false)
    
    // Clear cart and form
    if (onClearCart) {
      onClearCart()
    } else {
      items.forEach((item) => onRemove(item.id))
    }
    setFormData({ fullName: "", phone: "", city: "", address: "" })
    
    // Close cart after a delay
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  if (showCheckout) {
    return (
      <>
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="border-b border-border p-4 flex items-center justify-between sticky top-0 bg-card">
              <h2 className="text-lg font-semibold text-foreground">Informations de livraison</h2>
              <button onClick={() => setShowCheckout(false)} className="p-1 hover:bg-secondary rounded-md transition">
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            <form onSubmit={handleCheckout} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nom complet</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d8bd78] bg-background text-foreground"
                  placeholder="Votre nom complet"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Numéro de téléphone</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d8bd78] bg-background text-foreground"
                  placeholder="06XXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Ville</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d8bd78] bg-background text-foreground"
                  placeholder="Votre ville"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Adresse</label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d8bd78] bg-background text-foreground resize-none"
                  placeholder="Votre adresse complète"
                />
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between text-lg font-semibold text-foreground mb-4">
                  <span>Total :</span>
                  <span>MAD {total.toFixed(2)}</span>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#d8bd78] text-white py-3 rounded-lg font-semibold hover:bg-[#d8bd78]/90 transition-colors"
                >
                  Confirmer la commande
                </button>
              </div>
            </form>
          </div>
        </div>
        {showToast && (
          <Toast
            message="Commande confirmée avec succès !"
            type="success"
            onClose={() => setShowToast(false)}
          />
        )}
      </>
    )
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-sm w-full max-w-md h-[90vh] flex flex-col max-h-[600px]">
          {/* Header */}
          <div className="border-b border-border p-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Panier</h2>
            <button onClick={onClose} className="p-1 hover:bg-secondary rounded-md transition">
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {items.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Votre panier est vide</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-3 border-b border-border pb-4">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-sm bg-muted"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground line-clamp-2">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">MAD {item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 bg-secondary text-foreground rounded text-xs hover:bg-border transition"
                      >
                        −
                      </button>
                      <span className="text-sm font-medium text-foreground w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 bg-secondary text-foreground rounded text-xs hover:bg-border transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="text-destructive hover:bg-destructive/10 p-2 rounded-md transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex items-center justify-between text-lg font-semibold text-foreground">
              <span>Total :</span>
              <span>MAD {total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => setShowCheckout(true)}
              disabled={items.length === 0}
              className="w-full bg-[#d8bd78] text-white py-3 rounded-sm font-semibold hover:bg-[#d8bd78]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Commander
            </button>
            <button
              onClick={onClose}
              className="w-full bg-secondary text-foreground py-3 rounded-sm font-semibold hover:bg-border transition"
            >
              Continuer les achats
            </button>
          </div>
        </div>
      </div>
      {showToast && (
        <Toast
          message="Commande confirmée avec succès !"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  )
}
