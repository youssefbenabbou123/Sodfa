"use client"

import { useState } from "react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import Cart from "@/components/cart"
import { CATEGORIES } from "@/lib/products"
import { Sparkles } from "lucide-react"

export default function CollectionsPage() {
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems] = useState<
    Array<{ id: string; name: string; price: number; quantity: number; image: string }>
  >([])
  
  const removeFromCart = () => {}
  const updateQuantity = () => {}

  const collections = [
    {
      name: "Montres",
      description: "Garde-temps élégants pour la femme moderne",
      href: "/category/watches",
      image: "/montreSerpent.avif",
    },
    {
      name: "Colliers",
      description: "Pièces élégantes qui subliment toute tenue",
      href: "/category/necklaces",
      image: "/necklase.avif",
    },
    {
      name: "Bracelets",
      description: "Designs délicats et audacieux pour tous les styles",
      href: "/category/bracelets",
      image: "/braclet.webp",
    },
    {
      name: "Boucles d'oreilles",
      description: "Des perles classiques aux designs modernes",
      href: "/category/earrings",
      image: "/earrings.jpg",
    },
    {
      name: "Bagues",
      description: "Bagues sophistiquées pour les moments spéciaux",
      href: "/category/rings",
      image: "/Ring.webp",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation cartCount={cartItems.length} onCartClick={() => setCartOpen(!cartOpen)} />
      
      {/* Hero Section */}
      <section className="relative pt-40 md:pt-48 lg:pt-56 pb-20 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.02),transparent_50%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d8bd78]/10 text-[#d8bd78] text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Collections Sélectionnées</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-[#d8bd78] via-[#e8cd88] to-[#d8bd78] bg-clip-text text-transparent">
              Nos Collections
            </h1>
            <p className="text-lg md:text-xl text-[#b8a568] max-w-2xl mx-auto leading-relaxed">
              Explorez nos collections soigneusement sélectionnées d'accessoires de luxe, chaque pièce choisie pour sublimer votre style
            </p>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-12 pb-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {collections.map((collection, index) => (
              <Link
                key={collection.name}
                href={collection.href}
                className="group relative aspect-square rounded-3xl overflow-hidden bg-card border border-border/50 hover:border-[#d8bd78]/40 transition-all duration-700 hover:shadow-2xl hover:shadow-[#d8bd78]/20 hover:-translate-y-3"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image Container */}
                <div className="absolute inset-0">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000 ease-out"
                  />
                  {/* Modern Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/40 to-black/80 group-hover:from-black/30 group-hover:via-black/50 group-hover:to-black/90 transition-all duration-700" />
                  {/* Accent Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#d8bd78]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
                
                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                  {/* Top Badge */}
                  <div className="self-start">
                    <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                      Collection
                    </div>
                  </div>

                  {/* Bottom Content */}
                  <div className="space-y-3">
                    <div className="transform group-hover:translate-y-0 translate-y-1 transition-transform duration-500">
                      <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg group-hover:drop-shadow-xl transition-all">
                        {collection.name}
                      </h3>
                      <p className="text-white/85 text-sm md:text-base leading-relaxed mb-4 group-hover:text-white transition-colors">
                        {collection.description}
                      </p>
                    </div>
                    
                    {/* CTA Button */}
                    <div className="flex items-center gap-2 text-white group-hover:text-white transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
                      <span className="text-sm font-semibold">Explorer la Collection</span>
                    </div>
                  </div>
                </div>

                {/* Modern Border Glow Effect */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-[#d8bd78]/30 transition-all duration-700 pointer-events-none" />

                {/* Corner Accent */}
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#d8bd78]/20 backdrop-blur-sm border border-[#d8bd78]/30 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-500" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {cartOpen && (
        <Cart
          items={cartItems}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onClose={() => setCartOpen(false)}
        />
      )}
      <Footer />
    </div>
  )
}

