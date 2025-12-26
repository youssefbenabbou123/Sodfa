"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import Cart from "@/components/cart"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Send, Sparkles } from "lucide-react"

export default function ContactPage() {
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems] = useState<
    Array<{ id: string; name: string; price: number; quantity: number; image: string }>
  >([])
  
  const removeFromCart = () => {}
  const updateQuantity = () => {}
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus("success")
      setFormData({ name: "", email: "", subject: "", message: "" })
      setTimeout(() => setSubmitStatus("idle"), 5000)
    }, 1000)
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: ["hello@sodfa.com", "support@sodfa.com"],
      color: "text-blue-500"
    },
    {
      icon: Phone,
      title: "Téléphone",
      details: ["+212 XXX XXX XXX", "Lun-Ven, 9h-18h"],
      color: "text-green-500"
    },
    {
      icon: MapPin,
      title: "Adresse",
      details: ["Maroc", "Livraison gratuite partout au Maroc"],
      color: "text-purple-500"
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
                  Vous avez une question ou besoin d'aide ? Nous sommes là pour vous aider. Contactez-nous via 
                  l'un des canaux suivants.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon
                  return (
                    <div
                      key={info.title}
                      className="group relative p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors ${info.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-2 text-lg">{info.title}</h3>
                          {info.details.map((detail, i) => (
                            <p key={i} className="text-muted-foreground text-sm leading-relaxed">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-in fade-in slide-in-from-right-4 duration-700">
              <div className="relative p-8 md:p-10 rounded-2xl border border-border bg-card shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground font-medium">Nom</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      className="h-12 border-border focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre.email@exemple.com"
                      className="h-12 border-border focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-foreground font-medium">Sujet</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Comment pouvons-nous vous aider ?"
                      className="h-12 border-border focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-foreground font-medium">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Dites-nous en plus..."
                      rows={6}
                      className="border-border focus:border-primary transition-colors resize-none"
                    />
                  </div>

                  {submitStatus === "success" && (
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg animate-in fade-in slide-in-from-bottom-2">
                      <p className="text-green-800 dark:text-green-200 text-sm">
                        Merci ! Votre message a été envoyé avec succès. Nous vous répondrons bientôt.
                      </p>
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg animate-in fade-in slide-in-from-bottom-2">
                      <p className="text-red-800 dark:text-red-200 text-sm">
                        Une erreur s'est produite. Veuillez réessayer.
                      </p>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full h-12 text-base font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </form>
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

