"use client"

import Link from "next/link"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import { useState, use, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import Cart from "@/components/cart"
import Toast from "@/components/toast"
import { getProductById, getProducts, type Product } from "@/lib/products-api"

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<
    Array<{ id: string; name: string; price: number; quantity: number; image: string }>
  >([])
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true)
        const productData = await getProductById(id)
        setProduct(productData)
        
        if (productData) {
          // Load related products
          const allProducts = await getProducts()
          const related = allProducts
            .filter((p) => p.id !== productData.id && p.category === productData.category)
            .slice(0, 3)
          setRelatedProducts(related)
        }
      } catch (error) {
        console.error('Error loading product:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation cartCount={cartItems.length} onCartClick={() => setCartOpen(!cartOpen)} />
        <div className="pt-32 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-muted-foreground">Chargement du produit...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation cartCount={cartItems.length} onCartClick={() => setCartOpen(!cartOpen)} />
        <div className="pt-32 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Produit introuvable</h1>
            <Link href="/shop" className="text-primary hover:text-accent transition-colors">
              Retour à la boutique
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image]

  const addToCart = () => {
    const existingItem = cartItems.find((item) => item.id === product.id)
    if (existingItem) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      )
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.image,
        },
      ])
    }
    setToast({ message: `${product.name} ajouté au panier`, type: "success" })
    setCartOpen(true)
  }

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation cartCount={cartItems.length} onCartClick={() => setCartOpen(!cartOpen)} />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-36 relative z-40">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors cursor-pointer relative pointer-events-auto"
        >
          <ArrowLeft size={20} />
          Retour
        </button>
      </div>

      {/* Product Section */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Product Images */}
            <div className="relative">
              <div className="aspect-square bg-card rounded-2xl overflow-hidden shadow-xl relative border border-border">
                <img
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImageIndex((prev) =>
                          prev === 0 ? images.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10"
                      aria-label="Image précédente"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImageIndex((prev) =>
                          prev === images.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10 rotate-180"
                      aria-label="Image suivante"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === selectedImageIndex ? "bg-white" : "bg-white/50"
                          }`}
                          aria-label={`Image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                        index === selectedImageIndex
                          ? "border-[#d8bd78]"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-[#d8bd78]/20 text-foreground text-sm font-semibold rounded-full mb-4">
                  {product.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  {product.name}
                </h1>
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-light text-green-800 dark:text-green-600">{product.price}</span>
                    <span className="text-xl font-light text-green-800 dark:text-green-600">MAD</span>
                  </div>
                </div>
              </div>

              {product.description && (
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {product.description}
                </p>
              )}

              {/* Quantity & Add to Cart */}
              <div className="mt-auto">
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-semibold text-foreground">Quantité :</span>
                  <div className="flex items-center gap-2 border-2 border-border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-foreground hover:bg-[#d8bd78]/10 transition-colors"
                    >
                      −
                    </button>
                    <span className="px-4 py-2 text-foreground font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-foreground hover:bg-[#d8bd78]/10 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={addToCart}
                  className="w-full bg-[#d8bd78] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#d8bd78]/90 transition-colors flex items-center justify-center gap-3 mb-4"
                >
                  <ShoppingBag size={24} />
                  Ajouter au panier
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-8">Produits similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/product/${relatedProduct.id}`}
                  className="bg-card rounded-2xl overflow-hidden hover:shadow-lg transition-all border border-border"
                >
                  <div className="aspect-square bg-card relative overflow-hidden">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-2">{relatedProduct.category}</p>
                    <h3 className="font-bold text-foreground mb-2">{relatedProduct.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="font-light text-lg text-green-800 dark:text-green-600">{relatedProduct.price}</span>
                      <span className="font-light text-sm text-green-800 dark:text-green-600">MAD</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {cartOpen && (
        <Cart
          items={cartItems}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onClose={() => setCartOpen(false)}
          onClearCart={clearCart}
        />
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <Footer />
    </div>
  )
}

