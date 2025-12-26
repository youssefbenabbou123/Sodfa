"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import Cart from "@/components/cart"
import { MessageCircle, Phone, Send, Sparkles } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems] = useState<
    Array<{ id: string; name: string; price: number; quantity: number; image: string }>
  >([])
  
  const removeFromCart = () => {}
  const updateQuantity = () => {}

  const contactInfo = [
    {
      icon: MessageCircle,
      title: "WhatsApp",
      phone: "+212 629 651 392",
      hours: "Lun-Ven, 9h-18h",
      link: "https://wa.me/212629651392",
      description: "Contactez-nous directement via WhatsApp pour une réponse rapide et personnalisée. Notre équipe est disponible du lundi au vendredi de 9h à 18h.",
      color: "text-green-500"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation cartCount={cartItems.length} onCartClick={() => setCartOpen(!cartOpen)} />
      
      {/* Hero Section */}
      <section className="relative pt-40 md:pt-48 lg:pt-56 pb-20 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.02),transparent_50%)]"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Contactez-nous</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-[#d8bd78] via-[#e8cd88] to-[#d8bd78] bg-clip-text text-transparent">
              Contactez-nous
            </h1>
            <p className="text-lg md:text-xl text-[#b8a568] max-w-2xl mx-auto leading-relaxed">
              Nous serions ravis d'avoir de vos nouvelles. Contactez notre équipe et nous répondrons dans les plus brefs délais.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 pb-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Information */}
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Contactez-nous</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Vous avez une question sur nos produits ou besoin d'aide ? Contactez-nous directement via WhatsApp. 
                  Notre équipe est prête à vous aider avec le sourire !
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon
                  return (
                    <Link
                      key={info.title}
                      href={info.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block p-6 rounded-xl border border-border bg-card hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 hover:-translate-y-1"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 p-4 rounded-xl bg-green-500/10 group-hover:bg-green-500/20 transition-colors ${info.color}`}>
                          <Icon className="w-7 h-7 text-green-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-foreground mb-3 text-xl">{info.title}</h3>
                          <div className="space-y-2 mb-3">
                            <p className="text-foreground font-semibold text-lg">
                              {info.phone}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              {info.hours}
                            </p>
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {info.description}
                          </p>
                          <div className="mt-4 inline-flex items-center gap-2 text-green-600 font-medium text-sm group-hover:gap-3 transition-all">
                            <span>Envoyer un message</span>
                            <Send className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/5 to-green-600/5 border border-green-500/20">
                <h3 className="font-semibold text-foreground mb-2">Pourquoi WhatsApp ?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  WhatsApp nous permet de vous répondre rapidement et de manière personnalisée. Que ce soit pour 
                  des questions sur nos produits, des demandes de personnalisation ou un suivi de commande, 
                  nous sommes là pour vous accompagner !
                </p>
              </div>
            </div>

            {/* WhatsApp CTA Card */}
            <div className="animate-in fade-in slide-in-from-right-4 duration-700">
              <div className="relative p-8 md:p-10 rounded-2xl border border-border bg-gradient-to-br from-card to-green-500/5 shadow-lg overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-green-500/10">
                      <MessageCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                      Parlez-nous directement
                    </h2>
                  </div>
                  
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    Cliquez sur le bouton ci-dessous pour nous contacter directement via WhatsApp. 
                    Notre équipe vous répondra dans les plus brefs délais pendant nos heures d'ouverture.
                  </p>

                  <Link
                    href="https://wa.me/212629651392"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full gap-3 h-14 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 hover:scale-[1.02] group"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Ouvrir WhatsApp</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <div className="mt-6 pt-6 border-t border-border/50">
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-foreground font-medium">Téléphone</p>
                        <p className="text-muted-foreground">+212 629 651 392</p>
                      </div>
                      <div className="text-right">
                        <p className="text-foreground font-medium">Horaires</p>
                        <p className="text-muted-foreground">Lun-Ven, 9h-18h</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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

