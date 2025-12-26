"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import Navigation from "@/components/navigation"
import ProductCard from "@/components/product-card"
import Footer from "@/components/footer"
import Cart from "@/components/cart"
import Toast from "@/components/toast"
import { getProductsByCategory, getCategoryName, CATEGORIES } from "@/lib/products"
import { Sparkles } from "lucide-react"

export default function CategoryPage() {
  const params = useParams()
  const categoryParam = (params?.category as string) || "all"
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<
    Array<{ id: string; name: string; price: number; quantity: number; image: string }>
  >([])
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  // Normalize category - capitalize first letter
  const category = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1).toLowerCase()
  const products = getProductsByCategory(category)
  const categoryName = getCategoryName(category)

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

  // Validate category
  const validCategory = CATEGORIES.includes(category)

  return (
    <div className="min-h-screen bg-background">
      <Navigation cartCount={cartItems.length} onCartClick={() => setCartOpen(!cartOpen)} />
      
      {/* Hero Section */}
      <section className="relative pt-40 md:pt-48 lg:pt-56 pb-20 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.02),transparent_50%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {validCategory && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>{categoryName}</span>
              </div>
            )}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {validCategory ? categoryName : "Category Not Found"}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {validCategory 
                ? "Handpicked accessories for every style and occasion" 
                : "The category you're looking for doesn't exist"}
            </p>
          </div>

          {/* Category Navigation */}
          {validCategory && (
            <div className="flex flex-wrap gap-3 justify-center mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
              {CATEGORIES.map((cat, index) => (
                <Link
                  key={cat}
                  href={`/category/${cat.toLowerCase()}`}
                  className={`group relative px-6 py-3 text-sm font-medium rounded-full transition-all duration-300 ${
                    cat === category
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-card border border-border text-foreground hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Grid */}
      {validCategory && products.length > 0 && (
        <section className="py-12 pb-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} onAddToCart={addToCart} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {validCategory && products.length === 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="p-12 rounded-2xl bg-card border border-border">
              <p className="text-xl text-muted-foreground">No products found in this category.</p>
            </div>
          </div>
        </section>
      )}

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

