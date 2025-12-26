"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

interface NavigationProps {
  cartCount: number
  onCartClick: () => void
}

export default function Navigation({ cartCount, onCartClick }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    if (typeof window !== 'undefined') {
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // On white pages (non-home), always use dark icons
  const shouldUseDarkIcons = !isHomePage || scrolled

  const menuLinks = [
    { href: "/shop", label: "Boutique" },
    { href: "/collections", label: "Collections" },
    { href: "/about", label: "À propos" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <>
      {/* Top Banner - Free Delivery */}
      <div className="fixed top-0 w-full bg-black text-white text-center py-2 text-sm font-medium z-50">
        <div className="flex items-center justify-center gap-2">
          <span>Livraison gratuite partout au Maroc !!</span>
          <span>🚚</span>
        </div>
          </div>
      
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
              scrolled 
            ? "bg-white/80 backdrop-blur-md shadow-sm py-2 top-8" 
            : "bg-transparent py-4 top-8"
        }`}
      >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 relative">
          {/* Mobile Menu Button - Left */}
          <button
            className={`md:hidden p-2 hover:bg-primary/10 rounded-full transition-colors z-10 ${
              shouldUseDarkIcons ? "text-foreground" : "text-white"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Menu - Left side */}
          <div className="hidden md:flex items-center gap-10 absolute right-1/2 mr-32">
            {menuLinks.slice(0, 2).map((link) => (
          <Link 
                key={link.href}
                href={link.href}
                className={`font-medium hover:text-primary transition-colors text-lg relative group ${
                  shouldUseDarkIcons ? "text-foreground" : "text-white"
                }`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
          </Link>
            ))}
          </div>

          {/* Logo - Centered */}
          <Link 
            href="/"
            className="absolute left-1/2 transform -translate-x-1/2 flex-shrink-0 transition-all duration-300 z-10 group"
          >
            <Image
              src="/company-removebg-preview.png"
              alt="SODFA"
              width={200}
              height={100}
              className={`object-contain transition-all duration-300 group-hover:scale-105 brightness-110 contrast-110 drop-shadow-lg ${
                scrolled ? "h-20 w-auto" : "h-24 w-auto"
            }`}
              priority
            />
          </Link>

          {/* Desktop Menu - Right side */}
          <div className="hidden md:flex items-center gap-10 absolute left-1/2 ml-32">
            {menuLinks.slice(2).map((link) => (
          <Link 
                key={link.href}
                href={link.href}
                className={`font-medium hover:text-primary transition-colors text-lg relative group ${
                  shouldUseDarkIcons ? "text-foreground" : "text-white"
                }`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
          </Link>
            ))}
        </div>

          {/* Cart Icon - Far Right */}
          <div className="ml-auto flex items-center gap-3 z-10">
          <button 
            onClick={onCartClick} 
              className={`relative p-2 hover:bg-primary/10 rounded-full transition-colors ${
                shouldUseDarkIcons ? "text-foreground" : "text-white"
              }`}
            >
              <ShoppingBag size={24} />
            {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay - Full Screen Centered */}
        <div
          className={`fixed inset-0 bg-background/95 backdrop-blur-sm z-40 md:hidden transition-all duration-300 ease-in-out flex flex-col justify-center items-center space-y-8 ${
            mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          style={{ top: "0", height: "100vh" }}
        >
          <button
            className={`absolute top-6 right-6 p-2 ${scrolled ? "text-primary" : "text-foreground"}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={32} />
          </button>

          <div className="flex flex-col items-center space-y-6 text-center">
            {/* Logo in Mobile Menu */}
              <Link 
              href="/"
                onClick={() => setMobileMenuOpen(false)}
              className="mb-4"
            >
              <Image
                src="/company-removebg-preview.png"
                alt="SODFA"
                width={200}
                height={100}
                className="object-contain brightness-110 contrast-110 drop-shadow-lg h-28 w-auto"
              />
              </Link>
            {menuLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                className="text-3xl font-bold text-primary hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                onCartClick()
                setMobileMenuOpen(false)
              }}
              className="text-3xl font-bold text-primary hover:text-accent transition-colors flex items-center gap-3 justify-center"
            >
              <ShoppingBag size={32} />
              Panier {cartCount > 0 && `(${cartCount})`}
            </button>
          </div>
        </div>
      </div>
    </nav>
    </>
  )
}
