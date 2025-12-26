import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative -mt-28 pt-28 pb-24 md:pb-32 lg:pb-40 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 -top-20">
        <img 
          src="/serpent.jpg"
          alt="Collection de Luxe" 
          className="w-full h-full object-cover object-center scale-105 animate-in fade-in duration-1000"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/100 via-black/40 to-black/100"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-44 md:pt-40 lg:pt-48">
        <div className="max-w-2xl mx-auto space-y-8 text-center">
          <h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance text-white leading-tight opacity-0 animate-[fadeInUp_1.2s_ease-out_0.3s_forwards]"
          >
            <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
              L'Art du{" "}
            </span>
            <span className="bg-gradient-to-r from-[#d8bd78] via-[#e8cd88] to-[#d8bd78] bg-clip-text text-transparent">
              Design Moderne
            </span>
          </h1>
          <p 
            className="text-lg md:text-xl text-white/90 max-w-xl mx-auto leading-relaxed opacity-0 animate-[fadeInUp_1.2s_ease-out_0.8s_forwards]"
          >
            Accessoires sélectionnés qui subliment votre style.découvrez des pièces
            qui définissent la sophistication.
          </p>
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-[fadeInUp_1.2s_ease-out_1.3s_forwards]"
          >
            <Link 
              href="/category/all"
              className="inline-flex items-center justify-center bg-[#d8bd78] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#d8bd78]/90 transition-colors duration-300"
            >
              Explorer la Collection
            </Link>
            <Link 
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
            >
              Acheter Maintenant
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1 h-3 rounded-full bg-white/50 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
