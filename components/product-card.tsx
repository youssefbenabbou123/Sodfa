"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useState } from "react"

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    image: string
    rating: number
    category: string
  }
  onAddToCart: (product: { id: string; name: string; price: number; image: string }) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
  }

  return (
    <div className="group relative bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#d8bd78]/10 hover:border-[#d8bd78]/40 transition-all duration-500 hover:-translate-y-2">
      {/* Image Section */}
      <Link href={`/product/${product.id}`} className="block relative">
        <div className="aspect-square bg-muted overflow-hidden relative">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </Link>

      {/* Cart Icon Button - Always Visible */}
      <button
        onClick={handleAddToCart}
        className="absolute top-3 right-3 z-20 bg-[#d8bd78] text-white p-2.5 rounded-full shadow-lg hover:bg-[#d8bd78]/90 hover:scale-110 transition-all duration-300"
        aria-label="Ajouter au panier"
      >
        <ShoppingBag className="w-4 h-4" />
      </button>

      {/* Content Section */}
      <Link href={`/product/${product.id}`} className="block">
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground text-base line-clamp-2 group-hover:text-[#d8bd78] transition-colors duration-300 mb-2">
                {product.name}
              </h3>
              <span className="inline-block px-2 py-0.5 bg-[#d8bd78]/10 text-[#d8bd78] text-xs font-medium rounded-full">
                {product.category}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <span className="text-sm text-muted-foreground font-medium">Prix</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-light text-green-800 dark:text-green-600">{product.price}</span>
              <span className="text-sm font-light text-green-800 dark:text-green-600">MAD</span>
            </div>
          </div>
          {isAdded && (
            <div className="mt-2">
              <span className="text-xs font-semibold text-[#d8bd78] bg-[#d8bd78]/10 px-3 py-1.5 rounded-full border border-[#d8bd78]/20 animate-in zoom-in duration-300 inline-block">
                Ajouté ✓
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}
