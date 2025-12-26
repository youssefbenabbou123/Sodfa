"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import ProductCard from "./product-card"
import { getProducts, CATEGORIES, type Product } from "@/lib/products-api"

interface ProductGridProps {
  onAddToCart: (product: { id: string; name: string; price: number; image: string }) => void
  featuredOnly?: boolean
}

export default function ProductGrid({ onAddToCart, featuredOnly = false }: ProductGridProps) {
  const [displayProducts, setDisplayProducts] = useState<Product[]>([])

  useEffect(() => {
    async function loadProducts() {
      try {
        const allProducts = await getProducts()
        // Show all products or just featured ones (first 8)
        const products = featuredOnly ? allProducts.slice(0, 8) : allProducts
        setDisplayProducts(products)
      } catch (error) {
        console.error('Error loading products:', error)
      }
    }
    loadProducts()
  }, [featuredOnly])

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
          {CATEGORIES.map((category) => {
            // Map French category to URL format
            const categoryUrlMap: Record<string, string> = {
              'Tout': 'all',
              'Montres': 'watches',
              'Colliers': 'necklaces',
              'Bracelets': 'bracelets',
              "Boucles d'oreilles": 'earrings',
              'Bagues': 'rings',
            }
            const urlParam = categoryUrlMap[category] || category.toLowerCase()
            return (
              <Link
                key={category}
                href={`/category/${urlParam}`}
                className="px-4 py-2 text-sm font-medium rounded-full transition bg-secondary text-foreground hover:bg-border"
              >
                {category}
              </Link>
            )
          })}
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
