"use client"

import Link from "next/link"
import ProductCard from "./product-card"
import { PRODUCTS, CATEGORIES } from "@/lib/products"

interface ProductGridProps {
  onAddToCart: (product: { id: string; name: string; price: number; image: string }) => void
  featuredOnly?: boolean
}

export default function ProductGrid({ onAddToCart, featuredOnly = false }: ProductGridProps) {
  // Show all products or just featured ones (first 8)
  const displayProducts = featuredOnly ? PRODUCTS.slice(0, 8) : PRODUCTS

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-3">Our Collection</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Handpicked accessories for every style and occasion
          </p>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {CATEGORIES.map((category) => (
            <Link
              key={category}
              href={`/category/${category.toLowerCase()}`}
              className="px-4 py-2 text-sm font-medium rounded-full transition bg-secondary text-foreground hover:bg-border"
            >
              {category}
            </Link>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>

        {featuredOnly && (
          <div className="text-center mt-12">
            <Link
              href="/category/all"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-sm font-semibold hover:opacity-90 transition"
            >
              View All Products
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
