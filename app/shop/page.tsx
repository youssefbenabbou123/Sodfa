"use client"

import { useState, useMemo, useEffect } from "react"
import Navigation from "@/components/navigation"
import ProductCard from "@/components/product-card"
import Footer from "@/components/footer"
import Cart from "@/components/cart"
import Toast from "@/components/toast"
import { getProducts, CATEGORIES, getCategoryName, type Product } from "@/lib/products-api"
import Link from "next/link"
import { Sparkles, Search, ChevronDown, Filter, X } from "lucide-react"

export default function ShopPage() {
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<
    Array<{ id: string; name: string; price: number; quantity: number; image: string }>
  >([])
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tout")
  const [sortBy, setSortBy] = useState("pertinence")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

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

  // Fetch products from MongoDB
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        console.log('🔄 Loading products from API...')
        const allProducts = await getProducts()
        console.log('✅ Products loaded:', allProducts.length)
        setProducts(allProducts)
      } catch (error) {
        console.error('❌ Error loading products:', error)
        setToast({ message: "Erreur lors du chargement des produits", type: "error" })
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== "Tout") {
      const categoryMap: Record<string, string> = {
        "Montres": "Watches",
        "Colliers": "Necklaces",
        "Bracelets": "Bracelets",
        "Boucles d'oreilles": "Earrings",
        "Bagues": "Rings",
      }
      const englishCategory = categoryMap[selectedCategory] || selectedCategory
      filtered = filtered.filter(
        (p) => p.category === englishCategory || p.category === selectedCategory
      )
    }

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "prix-croissant":
          return a.price - b.price
        case "prix-decroissant":
          return b.price - a.price
        case "nom-az":
          return a.name.localeCompare(b.name, "fr")
        case "nom-za":
          return b.name.localeCompare(a.name, "fr")
        case "pertinence":
        default:
          // Keep original order (pertinence)
          return 0
      }
    })

    return sorted
  }, [products, searchTerm, selectedCategory, sortBy])

  return (
    <div className="min-h-screen bg-background">
      <Navigation cartCount={cartItems.length} onCartClick={() => setCartOpen(!cartOpen)} />
      
      {/* Hero Section */}
      <section className="relative pt-40 md:pt-48 lg:pt-56 pb-6 md:pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.02),transparent_50%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Collection de Luxe</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-[#d8bd78] via-[#e8cd88] to-[#d8bd78] bg-clip-text text-transparent">
              Toute la Boutique
            </h1>
            <p className="text-lg md:text-xl text-[#b8a568] max-w-2xl mx-auto leading-relaxed">
              Découvrez notre collection complète d'accessoires de luxe, soigneusement sélectionnés pour la femme moderne
            </p>
          </div>

          {/* Category Navigation */}
          <div className="flex flex-nowrap gap-3 justify-start md:justify-center mb-0 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 md:mx-0 md:px-0">
            {CATEGORIES.map((category, index) => {
              // Map French category names to URL slugs
              const categoryMap: Record<string, string> = {
                "Tout": "/collections",
                "Montres": "/category/watches",
                "Colliers": "/category/necklaces",
                "Bracelets": "/category/bracelets",
                "Boucles d'oreilles": "/category/earrings",
                "Bagues": "/category/rings",
              }
              const href = categoryMap[category] || "/collections"
              
              return (
                <Link
                  key={category}
                  href={href}
                  className={`group relative px-6 py-3 text-sm font-medium rounded-full transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                    selectedCategory === category
                      ? "bg-[#d8bd78] text-white shadow-lg shadow-[#d8bd78]/20"
                      : "bg-card border border-border hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="relative z-10">{category}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Compact Filters Section */}
      <section className="py-3 bg-background border-b border-border sticky top-28 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          {/* Compact Header */}
          <div className="flex items-center justify-between gap-4">
            {/* Filter Button */}
            <button
              onClick={() => {
                setShowFilters(!showFilters)
                if (showFilters) setShowSearch(false)
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:border-[#d8bd78] hover:bg-[#d8bd78]/5 transition-all"
            >
              <Filter size={18} />
              <span>Filtrer par</span>
              {showFilters && <X size={16} />}
            </button>

            {/* Product Count */}
            <div className="text-sm text-muted-foreground whitespace-nowrap flex-1 text-center">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""}
            </div>

            {/* Search Icon Button */}
            <button
              onClick={() => {
                setShowSearch(!showSearch)
                if (showSearch) setShowFilters(false)
              }}
              className="p-2 text-foreground hover:text-[#d8bd78] transition-colors"
              aria-label="Rechercher"
            >
              {showSearch ? <X size={20} /> : <Search size={20} />}
            </button>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 pb-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-foreground whitespace-nowrap">Trier par:</label>
                <div className="relative flex-1">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none w-full pl-4 pr-10 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d8bd78]/20 focus:border-[#d8bd78] transition-all cursor-pointer text-foreground text-sm"
                  >
                    <option value="pertinence">Pertinence</option>
                    <option value="prix-croissant">Prix : croissant</option>
                    <option value="prix-decroissant">Prix : décroissant</option>
                    <option value="nom-az">Nom : A-Z</option>
                    <option value="nom-za">Nom : Z-A</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
                </div>
              </div>
            </div>
          )}

          {/* Expandable Search */}
          {showSearch && (
            <div className="mt-4 pb-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d8bd78]/20 focus:border-[#d8bd78] transition-all text-sm"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-12 pb-24">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">Chargement des produits...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">Aucun produit trouvé</p>
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("Tout")
                  setSortBy("pertinence")
                }}
                className="text-[#d8bd78] hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} onAddToCart={addToCart} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

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
