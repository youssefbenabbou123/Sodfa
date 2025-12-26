"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import Cart from "@/components/cart"
import { Sparkles, Heart, Award, Shield } from "lucide-react"

export default function AboutPage() {
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems] = useState<
    Array<{ id: string; name: string; price: number; quantity: number; image: string }>
  >([])
  
  const removeFromCart = () => {}
  const updateQuantity = () => {}

  const values = [
    {
      icon: Heart,
      title: "Passion pour l'Élégance",
      description: "Chaque pièce est sélectionnée avec passion et un œil pour la beauté intemporelle."
    },
    {
      icon: Award,
      title: "Excellence en Qualité",
      description: "Nous collaborons avec des artisans qui partagent notre engagement envers l'excellence."
    },
    {
      icon: Shield,
      title: "Votre Confiance Compte",
      description: "Nous garantissons chaque produit avec notre garantie de satisfaction."
    }
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Notre Histoire</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-[#d8bd78] via-[#e8cd88] to-[#d8bd78] bg-clip-text text-transparent">
              À Propos de SODFA
            </h1>
            <p className="text-lg md:text-xl text-[#b8a568] max-w-2xl mx-auto leading-relaxed">
              Créer l'élégance pour la femme moderne
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 pb-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="space-y-16">
            {/* Introduction */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="prose prose-lg max-w-none">
                <p className="text-xl md:text-2xl leading-relaxed text-foreground font-light mb-6">
                  Chez <span className="font-semibold">SODFA</span>, nous croyons que chaque femme mérite de se sentir élégante, confiante et sophistiquée.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Notre collection sélectionnée d'accessoires de luxe représente l'élégance intemporelle rencontrant le design moderne, 
                  soigneusement sélectionnés pour sublimer votre style personnel. Chaque pièce raconte une histoire de savoir-faire, 
                  de qualité et de recherche de la beauté.
                </p>
              </div>
            </div>

            {/* Values Grid */}
            <div className="grid md:grid-cols-3 gap-8 my-16">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div
                    key={value.title}
                    className="group relative p-8 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </div>
                )
              })}
            </div>

            {/* Mission */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <div className="relative p-8 md:p-12 rounded-2xl bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-primary/10">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Notre Mission</h2>
                <p className="text-lg leading-relaxed text-muted-foreground max-w-3xl">
                  Nous nous consacrons à offrir à la femme moderne des accessoires de luxe soigneusement sélectionnés 
                  qui combinent un savoir-faire exceptionnel avec un design contemporain. Des montres élégantes aux 
                  colliers élégants, chaque pièce de notre collection est choisie pour vous aider à exprimer votre 
                  style unique et votre sophistication.
                </p>
              </div>
            </div>

            {/* Quality */}
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Qualité & Savoir-faire</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Chaque accessoire de notre collection subit une sélection rigoureuse pour garantir qu'il répond à nos 
                normes élevées de qualité, de design et d'élégance. Nous collaborons avec des artisans et 
                designers de confiance pour vous apporter des pièces qui résisteront à l'épreuve du temps, tant en style qu'en durabilité.
              </p>
            </div>

            {/* Promise */}
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Notre Promesse</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Lorsque vous achetez chez SODFA, vous n'achetez pas seulement un accessoire – vous investissez dans 
                une pièce qui reflète votre style personnel et votre sophistication. Nous nous engageons à 
                fournir un service client exceptionnel et à garantir que chaque achat vous apporte joie 
                et confiance.
              </p>
            </div>
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

