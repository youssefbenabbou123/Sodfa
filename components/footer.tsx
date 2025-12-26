import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, User } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8 text-center md:text-left">
          {/* Brand */}
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <Link href="/">
                <Image
                  src="/company-removebg-preview.png"
                  alt="SODFA"
                  width={300}
                  height={150}
                  className="object-contain brightness-110 contrast-110 drop-shadow-lg h-32 md:h-40 w-auto"
                />
              </Link>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold mb-4">Boutique</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link href="/category/all" className="hover:opacity-100 transition">
                  Tout
                </Link>
              </li>
              <li>
                <Link href="/category/watches" className="hover:opacity-100 transition">
                  Montres
                </Link>
              </li>
              <li>
                <Link href="/category/necklaces" className="hover:opacity-100 transition">
                  Colliers
                </Link>
              </li>
              <li>
                <Link href="/category/bracelets" className="hover:opacity-100 transition">
                  Bracelets
                </Link>
              </li>
              <li>
                <Link href="/category/earrings" className="hover:opacity-100 transition">
                  Boucles d'oreilles
                </Link>
              </li>
              <li>
                <Link href="/category/rings" className="hover:opacity-100 transition">
                  Bagues
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Entreprise</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <a href="#" className="hover:opacity-100 transition">
                  À propos
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition">
                  Carrières
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">Suivez-nous</h3>
            <div className="flex gap-4 justify-center md:justify-start">
              <a href="#" className="hover:opacity-80 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:opacity-80 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:opacity-80 transition">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-sm opacity-80 relative">
          <p>&copy; 2025 SODFA. Tous droits réservés.</p>
          <Link
            href="/admin/login"
            className="absolute bottom-4 right-4 p-3 bg-[#d8bd78] hover:bg-[#d8bd78]/90 rounded-full transition-colors shadow-lg"
            title="Connexion Admin"
          >
            <User className="w-5 h-5 text-white" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
