"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, X, Star, Image as ImageIcon } from "lucide-react"
import { motion } from "framer-motion"
import imageCompression from 'browser-image-compression'

interface ImageUploadProps {
  images: string[]
  mainImageIndex: number
  onImagesChange: (images: string[]) => void
  onMainImageChange: (index: number) => void
  onError?: (message: string) => void
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes

export default function ImageUpload({
  images,
  mainImageIndex,
  onImagesChange,
  onMainImageChange,
  onError,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Handle paste event
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      // Only handle paste if not uploading
      if (uploading) return

      const items = e.clipboardData?.items
      if (!items) return

      // Find image in clipboard
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.type.indexOf('image') !== -1) {
          e.preventDefault()
          
          const blob = item.getAsFile()
          if (!blob) continue

          // Convert blob to File
          const file = new File([blob], `pasted-image-${Date.now()}.png`, {
            type: blob.type || 'image/png',
            lastModified: Date.now(),
          })

          // Process the pasted image using handleFileSelect logic
          setUploading(true)
          const newImages: string[] = []

          try {
            if (!file.type.startsWith("image/")) {
              setUploading(false)
              if (onError) {
                onError("Format non supporté. Utilisez JPG, PNG, WEBP ou AVIF.")
              }
              return
            }

            try {
              let fileToUpload = file

              // Check file size
              if (file.size > MAX_FILE_SIZE) {
                // Try to compress the image
                try {
                  const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                  }
                  fileToUpload = await imageCompression(file, options)
                  
                  // Check if compression helped
                  if (fileToUpload.size > MAX_FILE_SIZE) {
                    setUploading(false)
                    if (onError) {
                      onError(`Image trop grande (${(file.size / 1024 / 1024).toFixed(2)}MB). Utilisez une image de moins de 10MB.`)
                    }
                    return
                  }
                } catch (compressionError) {
                  setUploading(false)
                  if (onError) {
                    onError(`Image trop grande (${(file.size / 1024 / 1024).toFixed(2)}MB). Utilisez une image de moins de 10MB.`)
                  }
                  return
                }
              }

              // Upload to Cloudinary
              const formData = new FormData()
              formData.append('file', fileToUpload)
              const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
              })
              const data = await response.json()
              
              if (!data.success) {
                throw new Error(data.error || 'Upload failed')
              }

              const cloudinaryUrl = data.url
              newImages.push(cloudinaryUrl)

              if (newImages.length > 0) {
                const updatedImages = [...images, ...newImages]
                onImagesChange(updatedImages)
                // If no main image is set, set the first one as main
                if (mainImageIndex === -1 && updatedImages.length > 0) {
                  onMainImageChange(0)
                }
              }
            } catch (error: any) {
              console.error("Error uploading pasted image:", error)
              if (onError) {
                if (error.message?.includes('too large') || error.message?.includes('File size')) {
                  onError("Image trop grande. Utilisez une image de moins de 10MB.")
                } else {
                  onError(`Erreur lors de l'upload. ${error.message || 'Réessayez.'}`)
                }
              }
            }
          } finally {
            setUploading(false)
          }
          
          break
        }
      }
    }

    // Add paste event listener to window
    window.addEventListener('paste', handlePaste)
    
    return () => {
      window.removeEventListener('paste', handlePaste)
    }
  }, [uploading, images, mainImageIndex, onImagesChange, onMainImageChange, onError])

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1, // Compress to max 1MB
      maxWidthOrHeight: 1920, // Max width or height
      useWebWorker: true,
    }
    
    try {
      const compressedFile = await imageCompression(file, options)
      return compressedFile
    } catch (error) {
      console.error('Error compressing image:', error)
      throw error
    }
  }

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    if (!data.success) {
      throw new Error(data.error || 'Upload failed')
    }

    return data.url // Return Cloudinary URL
  }

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading(true)
    const newImages: string[] = []
    const errors: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        if (!file.type.startsWith("image/")) {
          errors.push(`${file.name}: Format non supporté. Utilisez JPG, PNG, WEBP ou AVIF.`)
          continue
        }

        try {
          let fileToUpload = file

          // Check file size
          if (file.size > MAX_FILE_SIZE) {
            // Try to compress the image
            try {
              fileToUpload = await compressImage(file)
              
              // Check if compression helped (still might be > 10MB if very large)
              if (fileToUpload.size > MAX_FILE_SIZE) {
                errors.push(`${file.name}: Image trop grande (${(file.size / 1024 / 1024).toFixed(2)}MB). Utilisez une image de moins de 10MB.`)
                continue
              }
            } catch (compressionError) {
              errors.push(`${file.name}: Image trop grande (${(file.size / 1024 / 1024).toFixed(2)}MB). Utilisez une image de moins de 10MB.`)
              continue
            }
          }

          const cloudinaryUrl = await uploadToCloudinary(fileToUpload)
          newImages.push(cloudinaryUrl)
        } catch (error: any) {
          console.error("Error uploading file to Cloudinary:", error)
          
          // Check if error is about file size
          if (error.message?.includes('too large') || error.message?.includes('File size')) {
            errors.push(`${file.name}: Image trop grande. Utilisez une image de moins de 10MB.`)
          } else {
            errors.push(`${file.name}: Erreur lors de l'upload. ${error.message || 'Réessayez.'}`)
          }
        }
      }

      // Show errors if any
      if (errors.length > 0 && onError) {
        onError(errors.join('\n'))
      }

      if (newImages.length > 0) {
        const updatedImages = [...images, ...newImages]
        onImagesChange(updatedImages)
        // If no main image is set, set the first one as main
        if (mainImageIndex === -1 && updatedImages.length > 0) {
          onMainImageChange(0)
        }
      }
    } finally {
      setUploading(false)
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
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          uploading
            ? "border-gray-300 bg-gray-50 cursor-wait opacity-50"
            : isDragging
            ? "border-[#d8bd78] bg-[#d8bd78]/10 cursor-pointer"
            : "border-[#d8bd78]/30 hover:border-[#d8bd78] hover:bg-[#d8bd78]/5 cursor-pointer"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={uploading}
          className="hidden"
        />
        <Upload className="w-12 h-12 mx-auto mb-4 text-[#d8bd78]" />
        <p className="text-foreground font-medium mb-2">
          {uploading ? "Upload en cours..." : "Cliquez, glissez-déposez ou collez (Ctrl+V) pour uploader"}
        </p>
        <p className="text-sm text-muted-foreground">
          Formats acceptés: JPG, PNG, WEBP, AVIF
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Taille maximale: 10MB (les images seront automatiquement compressées si nécessaire)
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          💡 Astuce: Copiez une image et appuyez sur Ctrl+V (ou Cmd+V sur Mac) pour la coller directement
        </p>
        {uploading && (
          <div className="mt-4">
            <div className="w-8 h-8 border-4 border-[#d8bd78] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        )}
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


