import Link from "next/link"
import Image from "next/image"
import { Instagram, User } from "lucide-react"

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)

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
            <div className="flex gap-6 justify-center md:justify-start">
              <a 
                href="https://www.instagram.com/sodfa_accessories/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-10 h-10" />
              </a>
              <a 
                href="https://wa.me/212629651392" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition hover:scale-110"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-10 h-10" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-sm opacity-80">
          <div className="flex items-center justify-center gap-3">
            <p>&copy; 2025 SODFA. Tous droits réservés.</p>
            <Link
              href="/admin/login"
              className="hover:opacity-80 transition-colors"
              title="Connexion Admin"
            >
              <User className="w-5 h-5 text-white" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
