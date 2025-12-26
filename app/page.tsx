"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Hero from "@/components/hero"
import CollectionsSection from "@/components/collections-section"
import RecommendedSection from "@/components/recommended-section"
import Footer from "@/components/footer"
import Cart from "@/components/cart"
import Toast from "@/components/toast"

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<
    Array<{ id: string; name: string; price: number; quantity: number; image: string }>
  >([])
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const addToCart = (product: { id: string; name: string; price: number; image: string }) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    setToast({ message: `${product.name} ajouté au panier`, type: "success" })
  }

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCartItems((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity } : item)))
    }
  }

  const clearCart = () => {
    setCartItems([])
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation cartCount={cartItems.length} onCartClick={() => setCartOpen(!cartOpen)} />
      <main className="relative">
        <Hero />
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background -z-10" />
          <CollectionsSection />
          <RecommendedSection onAddToCart={addToCart} />
        </div>
      </main>
      {cartOpen && (
        <Cart
          items={cartItems}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onClose={() => setCartOpen(false)}
          onClearCart={clearCart}
        />
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <Footer />
    </div>
  )
}
