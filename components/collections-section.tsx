"use client"

import Link from "next/link"

export default function CollectionsSection() {
  const collections = [
    {
      name: "Montres",
      description: "Garde-temps élégants pour la femme moderne",
      href: "/category/watches",
      image: "/MontreSerpent.avif",
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
    <section className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#d8bd78]/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-[#d8bd78] via-[#e8cd88] to-[#d8bd78] bg-clip-text text-transparent">
            Nos Collections
          </h2>
          <p className="text-lg text-[#b8a568] max-w-2xl mx-auto">
            Explorez nos collections soigneusement sélectionnées d'accessoires de luxe
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {collections.map((collection, index) => (
            <Link
              key={collection.name}
              href={collection.href}
              className="group relative aspect-square rounded-3xl overflow-hidden bg-card border border-border/50 hover:border-[#d8bd78]/40 transition-all duration-700 hover:-translate-y-3"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Image Container */}
              <div className="absolute inset-0">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000 ease-out"
                />
                {/* Modern Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/50 to-black/80 group-hover:from-black/40 group-hover:via-black/60 group-hover:to-black/90 transition-all duration-700" />
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
                    <span className="text-sm font-semibold">Explorer</span>
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
  )
}

