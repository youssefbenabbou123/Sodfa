"use client"

import { useRef, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ProductCard from "./product-card"
import { getProducts, type Product } from "@/lib/products-api"

interface RecommendedSectionProps {
  onAddToCart: (product: { id: string; name: string; price: number; image: string }) => void
}

export default function RecommendedSection({ onAddToCart }: RecommendedSectionProps) {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])

  useEffect(() => {
    async function loadRecommended() {
      try {
        const allProducts = await getProducts()
        // Get top 3 products by rating
        const recommended = [...allProducts]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3)
        setRecommendedProducts(recommended)
      } catch (error) {
        console.error('Error loading recommended products:', error)
      }
    }
    loadRecommended()
  }, [])
  
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current
    if (!container) return
    
    const children = container.querySelectorAll('.snap-center')
    if (children[index]) {
      const child = children[index] as HTMLElement
      const scrollLeft = child.offsetLeft - container.offsetLeft - (container.clientWidth - child.offsetWidth) / 2
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      })
      setCurrentIndex(index)
    }
  }

  const scrollLeft = () => {
    const nextIndex = (currentIndex - 1 + recommendedProducts.length) % recommendedProducts.length
    scrollToIndex(nextIndex)
  }

  const scrollRight = () => {
    const nextIndex = (currentIndex + 1) % recommendedProducts.length
    scrollToIndex(nextIndex)
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || recommendedProducts.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev - 1 + recommendedProducts.length) % recommendedProducts.length
        scrollToIndex(nextIndex)
        return nextIndex
      })
    }, 5000)

    // Handle scroll to update current index
    const handleScroll = () => {
      const children = container.querySelectorAll('.snap-center')
      let closestIndex = 0
      let closestDistance = Infinity

      children.forEach((child, index) => {
        const childElement = child as HTMLElement
        const distance = Math.abs(childElement.offsetLeft - container.scrollLeft - container.offsetLeft)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      setCurrentIndex(closestIndex)
    }

    container.addEventListener('scroll', handleScroll)

    return () => {
      clearInterval(interval)
      container.removeEventListener('scroll', handleScroll)
    }
  }, [recommendedProducts.length])

  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-[#d8bd78] via-[#e8cd88] to-[#d8bd78] bg-clip-text text-transparent">
            Choix des Clients
          </h2>
          <p className="text-lg text-[#b8a568] max-w-2xl mx-auto">
            Favoris sélectionnés par notre communauté
          </p>
        </div>

        {/* Recommended Products Carousel */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm border border-border/50 rounded-full p-3 shadow-lg hover:bg-white hover:border-[#d8bd78] transition-all duration-300 hover:scale-110"
            aria-label="Produit précédent"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm border border-border/50 rounded-full p-3 shadow-lg hover:bg-white hover:border-[#d8bd78] transition-all duration-300 hover:scale-110"
            aria-label="Produit suivant"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>

          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-4"
          >
            <div className="flex gap-6 md:gap-8 px-4 md:px-8">
              {recommendedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-[calc(100vw-3rem)] sm:w-[calc(100vw-4rem)] md:w-[500px] lg:w-[600px] snap-center animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} onAddToCart={onAddToCart} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {recommendedProducts.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? "bg-[#d8bd78] w-6" 
                    : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

