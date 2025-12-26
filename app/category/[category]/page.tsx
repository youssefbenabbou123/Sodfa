"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import Navigation from "@/components/navigation"
import ProductCard from "@/components/product-card"
import Footer from "@/components/footer"
import Cart from "@/components/cart"
import Toast from "@/components/toast"
import { getProductsByCategory, getCategoryName, CATEGORIES, type Product } from "@/lib/products-api"
import { Sparkles, Search, ChevronDown, Filter, X } from "lucide-react"

export default function CategoryPage() {
  const params = useParams()
  const categoryParam = (params?.category as string) || "all"
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<
    Array<{ id: string; name: string; price: number; quantity: number; image: string }>
  >([])
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("pertinence")
  const [showFilters, setShowFilters] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  // Map URL parameter to category names
  const categoryMap: Record<string, string> = {
    'all': 'Tout',
    'watches': 'Montres',
    'necklaces': 'Colliers',
    'bracelets': 'Bracelets',
    'earrings': "Boucles d'oreilles",
    'rings': 'Bagues',
    // Also handle French lowercase
    'tout': 'Tout',
    'montres': 'Montres',
    'colliers': 'Colliers',
    'boucles-d-oreilles': "Boucles d'oreilles",
    'bagues': 'Bagues',
  }

  const normalizedParam = categoryParam.toLowerCase()
  const category = categoryMap[normalizedParam] || categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1).toLowerCase()
  const categoryName = getCategoryName(category)

  // Fetch products from MongoDB
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        const categoryProducts = await getProductsByCategory(category)
        setProducts(categoryProducts)
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [category])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
          return 0
      }
    })

    return sorted
  }, [products, searchTerm, sortBy])

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

  // Validate category - check if mapped category exists in valid categories
  const validCategory = categoryMap[normalizedParam] ? true : CATEGORIES.includes(category) || categoryParam.toLowerCase() === 'all'

  return (
    <div className="min-h-screen bg-background">
      <Navigation cartCount={cartItems.length} onCartClick={() => setCartOpen(!cartOpen)} />
      
      {/* Hero Section */}
      <section className="relative pt-40 md:pt-48 lg:pt-56 pb-6 md:pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.02),transparent_50%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {validCategory && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                <span>{categoryName}</span>
              </div>
            )}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-[#d8bd78] via-[#e8cd88] to-[#d8bd78] bg-clip-text text-transparent">
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
            <div className="flex flex-nowrap gap-3 justify-start md:justify-center mb-0 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 md:mx-0 md:px-0">
              {CATEGORIES.map((cat, index) => {
                // Map French category to URL format
                const categoryUrlMap: Record<string, string> = {
                  'Tout': 'all',
                  'Montres': 'watches',
                  'Colliers': 'necklaces',
                  'Bracelets': 'bracelets',
                  "Boucles d'oreilles": 'earrings',
                  'Bagues': 'rings',
                }
                const urlParam = categoryUrlMap[cat] || cat.toLowerCase()
                return (
                  <Link
                    key={cat}
                    href={`/category/${urlParam}`}
                    className={`group relative px-6 py-3 text-sm font-medium rounded-full transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                      cat === category
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "bg-card border border-border text-foreground hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {cat}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Compact Filters Section */}
      {validCategory && (
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
      )}

      {/* Product Grid */}
      {validCategory && !loading && filteredProducts.length > 0 && (
        <section className="py-12 pb-24">
          <div className="max-w-7xl mx-auto px-4">
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
          </div>
        </section>
      )}

      {validCategory && loading && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="p-12 rounded-2xl bg-card border border-border">
              <p className="text-xl text-muted-foreground">Chargement des produits...</p>
            </div>
          </div>
        </section>
      )}

      {validCategory && !loading && filteredProducts.length === 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="p-12 rounded-2xl bg-card border border-border">
              <p className="text-xl text-muted-foreground mb-4">
                {searchTerm ? "Aucun produit trouvé pour votre recherche." : "Aucun produit trouvé dans cette catégorie."}
              </p>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setSortBy("pertinence")
                  }}
                  className="text-[#d8bd78] hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              )}
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

