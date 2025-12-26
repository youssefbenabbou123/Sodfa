"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Plus, Package, Search, Edit, Trash2, Image as ImageIcon } from "lucide-react"
import type { Product } from "@/lib/products"
import ImageUpload from "@/components/admin/ImageUpload"
import Toast from "@/components/toast"

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [productImages, setProductImages] = useState<string[]>([])
  const [mainImageIndex, setMainImageIndex] = useState<number>(-1)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
  })

  const categories = ["Watches", "Necklaces", "Bracelets", "Earrings", "Rings"]

  useEffect(() => {
    // Fetch products from MongoDB API
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data)
        }
      })
      .catch((error) => {
        console.error('Error fetching products:', error)
        setToast({ message: "Erreur lors du chargement des produits", type: "error" })
      })
  }, [])

  const handleSave = async () => {
    if (productImages.length === 0) {
      setToast({ message: "Veuillez uploader au moins une image", type: "error" })
      return
    }

    if (mainImageIndex === -1 || mainImageIndex >= productImages.length) {
      setToast({ message: "Veuillez sélectionner une image principale", type: "error" })
      return
    }

    const mainImage = productImages[mainImageIndex]

    try {
      if (editingProduct) {
        // Update existing product
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            category: formData.category,
            price: Number(formData.price),
            image: mainImage,
            images: productImages,
            rating: editingProduct.rating,
            description: formData.description,
          }),
        })

        const data = await response.json()
        if (data.success) {
          // Refresh products list
          const productsRes = await fetch('/api/products')
          const productsData = await productsRes.json()
          if (productsData.success) {
            setProducts(productsData.data)
          }
          setToast({ message: "Produit modifié avec succès", type: "success" })
        } else {
          setToast({ message: "Erreur lors de la modification", type: "error" })
        }
      } else {
        // Create new product
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            category: formData.category,
            price: Number(formData.price),
            image: mainImage,
            images: productImages,
            rating: 5,
            description: formData.description,
          }),
        })

        const data = await response.json()
        if (data.success) {
          // Refresh products list
          const productsRes = await fetch('/api/products')
          const productsData = await productsRes.json()
          if (productsData.success) {
            setProducts(productsData.data)
          }
          setToast({ message: "Produit ajouté avec succès", type: "success" })
        } else {
          setToast({ message: "Erreur lors de l'ajout", type: "error" })
        }
      }
      setShowForm(false)
      setEditingProduct(null)
      setFormData({ name: "", category: "", price: "", description: "" })
      setProductImages([])
      setMainImageIndex(-1)
    } catch (error) {
      console.error('Error saving product:', error)
      setToast({ message: "Erreur lors de la sauvegarde", type: "error" })
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      description: product.description || "",
    })
    
    // Load images from product
    const images = product.images && product.images.length > 0 ? product.images : [product.image]
    setProductImages(images)
    
    // Find main image index
    const mainIndex = images.findIndex((img) => img === product.image)
    setMainImageIndex(mainIndex >= 0 ? mainIndex : 0)
    
    setShowForm(true)
    
    // Scroll to top when editing
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        const product = products.find((p) => p.id === id)
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
        })

        const data = await response.json()
        if (data.success) {
          // Refresh products list
          const productsRes = await fetch('/api/products')
          const productsData = await productsRes.json()
          if (productsData.success) {
            setProducts(productsData.data)
          }
          setToast({ message: `Produit "${product?.name}" supprimé avec succès`, type: "success" })
        } else {
          setToast({ message: "Erreur lors de la suppression", type: "error" })
        }
      } catch (error) {
        console.error('Error deleting product:', error)
        setToast({ message: "Erreur lors de la suppression", type: "error" })
      }
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === "" || product.category === selectedCategory)
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-black text-[#d8bd78] mb-2">Produits</h1>
          <p className="text-muted-foreground">Créer, modifier et supprimer des produits</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingProduct(null)
            setFormData({ name: "", category: "", price: "", description: "" })
            setProductImages([])
            setMainImageIndex(-1)
            setShowForm(true)
            // Scroll to top when adding new product
            setTimeout(() => {
              window.scrollTo({ top: 0, behavior: "smooth" })
              formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            }, 100)
          }}
          className="flex items-center gap-2 px-6 py-3 bg-[#d8bd78] text-white rounded-xl font-bold hover:bg-[#d8bd78]/90 transition-all shadow-lg"
        >
          <Plus size={20} />
          Nouveau produit
        </motion.button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-xl border border-[#d8bd78]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d8bd78]/20 focus:border-[#d8bd78] transition-all"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 bg-white/80 backdrop-blur-xl border border-[#d8bd78]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d8bd78]/20 focus:border-[#d8bd78] transition-all"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Form */}
      {showForm && (
        <motion.div
          ref={formRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-[#d8bd78]/10 shadow-lg"
        >
          <h3 className="text-xl font-semibold text-foreground mb-4">
            {editingProduct ? "Modifier le produit" : "Nouveau produit"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nom</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-[#d8bd78]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d8bd78]/20 bg-background text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Catégorie</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-[#d8bd78]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d8bd78]/20 bg-background text-foreground"
              >
                <option value="">Sélectionner</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Prix (MAD)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-[#d8bd78]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d8bd78]/20 bg-background text-foreground"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-[#d8bd78]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d8bd78]/20 bg-background text-foreground"
              />
            </div>
            <div className="md:col-span-2">
              <ImageUpload
                images={productImages}
                mainImageIndex={mainImageIndex}
                onImagesChange={setProductImages}
                onMainImageChange={setMainImageIndex}
                onError={(message) => setToast({ message, type: "error" })}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSave}
              className="bg-[#d8bd78] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#d8bd78]/90 transition-colors"
            >
              Enregistrer
            </button>
            <button
              onClick={() => {
                setShowForm(false)
                setEditingProduct(null)
                setProductImages([])
                setMainImageIndex(-1)
              }}
              className="bg-secondary text-foreground px-6 py-2 rounded-lg font-semibold hover:bg-border transition-colors"
            >
              Annuler
            </button>
          </div>
        </motion.div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#d8bd78]/10 shadow-lg overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="relative h-48 bg-neutral-100">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon size={48} className="text-muted-foreground" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEdit(product)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-[#d8bd78] hover:bg-[#d8bd78] hover:text-white transition-colors"
                >
                  <Edit size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(product.id)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-[#d8bd78] mb-2">{product.name}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {product.description || "Aucune description"}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#d8bd78]">
                  {product.price} MAD
                </span>
                <div className="flex gap-2">
                  {product.category && (
                    <span className="px-2 py-1 bg-[#d8bd78]/10 text-[#d8bd78] text-xs font-bold rounded-full">
                      {product.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Aucun produit trouvé</p>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
