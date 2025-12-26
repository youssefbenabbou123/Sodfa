"use client"

import { useState, useRef } from "react"
import { Upload, X, Star, Image as ImageIcon } from "lucide-react"
import { motion } from "framer-motion"

interface ImageUploadProps {
  images: string[]
  mainImageIndex: number
  onImagesChange: (images: string[]) => void
  onMainImageChange: (index: number) => void
}

export default function ImageUpload({
  images,
  mainImageIndex,
  onImagesChange,
  onMainImageChange,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const newImages: string[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.type.startsWith("image/")) {
        try {
          const base64 = await convertFileToBase64(file)
          newImages.push(base64)
        } catch (error) {
          console.error("Error converting file:", error)
        }
      }
    }

    if (newImages.length > 0) {
      const updatedImages = [...images, ...newImages]
      onImagesChange(updatedImages)
      // If no main image is set, set the first one as main
      if (mainImageIndex === -1 && updatedImages.length > 0) {
        onMainImageChange(0)
      }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
    
    // Adjust main image index if needed
    if (index === mainImageIndex) {
      // If we removed the main image, set the first one as main
      onMainImageChange(newImages.length > 0 ? 0 : -1)
    } else if (index < mainImageIndex) {
      // If we removed an image before the main one, adjust the index
      onMainImageChange(mainImageIndex - 1)
    }
  }

  const setAsMain = (index: number) => {
    onMainImageChange(index)
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-foreground mb-2">
        Images du produit
      </label>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-[#d8bd78] bg-[#d8bd78]/10"
            : "border-[#d8bd78]/30 hover:border-[#d8bd78] hover:bg-[#d8bd78]/5"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        <Upload className="w-12 h-12 mx-auto mb-4 text-[#d8bd78]" />
        <p className="text-foreground font-medium mb-2">
          Cliquez ou glissez-déposez pour uploader
        </p>
        <p className="text-sm text-muted-foreground">
          Formats acceptés: JPG, PNG, WEBP, AVIF
        </p>
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group aspect-square rounded-xl overflow-hidden border-2 border-[#d8bd78]/20 hover:border-[#d8bd78] transition-all"
            >
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Main Image Badge */}
              {index === mainImageIndex && (
                <div className="absolute top-2 left-2 bg-[#d8bd78] text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-lg z-10">
                  <Star className="w-3 h-3 fill-white" />
                  Image principale
                </div>
              )}

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {index !== mainImageIndex && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setAsMain(index)
                    }}
                    className="p-2 bg-[#d8bd78] text-white rounded-lg hover:bg-[#d8bd78]/90 transition-colors"
                    title="Définir comme image principale"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeImage(index)
                  }}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  title="Supprimer l'image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Aucune image uploadée</p>
        </div>
      )}
    </div>
  )
}


