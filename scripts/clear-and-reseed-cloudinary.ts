/**
 * Clear products from MongoDB and re-seed with Cloudinary URLs
 * This script uploads images to Cloudinary first, then creates products with Cloudinary URLs
 * Run with: npx tsx scripts/clear-and-reseed-cloudinary.ts
 */

import dotenv from 'dotenv'
import { resolve } from 'path'
import mongoose from 'mongoose'
import Product from '../models/Product'
import { v2 as cloudinary } from 'cloudinary'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load .env.local file
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI || ''
const CLOUDINARY_URL = process.env.CLOUDINARY_URL || ''

// Configure Cloudinary explicitly in the script
if (CLOUDINARY_URL) {
  const url = new URL(CLOUDINARY_URL.replace('cloudinary://', 'https://'))
  cloudinary.config({
    cloud_name: url.hostname,
    api_key: url.username,
    api_secret: url.password,
    secure: true,
  })
  console.log('✅ Cloudinary configured from CLOUDINARY_URL')
} else {
  console.error('❌ CLOUDINARY_URL not found in environment variables')
  process.exit(1)
}

// Helper to upload image file to Cloudinary
async function uploadImageToCloudinary(imagePath: string): Promise<string> {
  try {
    // Read file from public folder
    const fullPath = join(process.cwd(), 'public', imagePath.replace(/^\//, ''))
    const imageBuffer = readFileSync(fullPath)
    const base64 = imageBuffer.toString('base64')
    const dataURI = `data:image/jpeg;base64,${base64}`

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          folder: 'ecommerce/products',
          resource_type: 'auto',
        },
        (error: any, result: any) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
    })

    const uploadResult = result as any
    return uploadResult.secure_url
  } catch (error) {
    console.error(`Error uploading ${imagePath}:`, error)
    // Return original path as fallback
    return imagePath
  }
}

// Helper to upload multiple images
async function uploadImages(imagePaths: string[]): Promise<string[]> {
  const uploadedUrls: string[] = []
  for (const path of imagePaths) {
    const url = await uploadImageToCloudinary(path)
    uploadedUrls.push(url)
    console.log(`  ✅ Uploaded: ${path} → ${url}`)
  }
  return uploadedUrls
}

const seedProducts = [
  {
    name: 'Montre Chronographe Élégante',
    category: 'Watches',
    price: 299,
    image: '/serpent.jpg',
        images: ['/serpent.jpg', '/montreSerpent.avif', '/leather-watch.png'],
    rating: 5,
    description:
      "Une montre chronographe sophistiquée alliant un design classique à une fonctionnalité moderne. Cette élégante montre combine une ingénierie de précision avec un style intemporel, en faisant l'accessoire parfait pour toute occasion.",
  },
  {
    name: 'Collier Chaîne en Or',
    category: 'Necklaces',
    price: 199,
    image: '/necklase.avif',
    images: ['/necklase.avif', '/gold-chain-necklace.jpg'],
    rating: 4.5,
    description:
      "Un magnifique collier chaîne en or qui ajoute de l'élégance à toute tenue. Fabriqué avec attention aux détails, cette pièce présente un design délicat mais durable qui complète à la fois les tenues décontractées et formelles.",
  },
  {
    name: 'Bracelet en Argent',
    category: 'Bracelets',
    price: 149,
    image: '/braclet.webp',
    images: ['/braclet.webp', '/silver-bracelet.png'],
    rating: 4,
    description:
      "Un bracelet en argent magnifiquement travaillé avec des détails complexes. Cette pièce polyvalente peut être portée seule pour un look minimaliste ou empilée avec d'autres bracelets pour un effet plus dramatique.",
  },
  {
    name: "Boucles d'Oreilles Perles Tombantes",
    category: 'Earrings',
    price: 129,
    image: '/earrings.jpg',
    images: ['/earrings.jpg', '/pearl-earrings.png'],
    rating: 5,
    description:
      "Des boucles d'oreilles perles tombantes élégantes qui dégagent sophistication et grâce. Ces pièces intemporelles présentent des perles lustrées suspendues à des montures en or délicates, parfaites pour les occasions spéciales ou l'élégance quotidienne.",
  },
  {
    name: 'Bague Diamant',
    category: 'Rings',
    price: 499,
    image: '/Ring.webp',
    images: ['/Ring.webp', '/sparkling-diamond-ring.png'],
    rating: 5,
    description:
      "Une bague diamant à couper le souffle avec une pierre centrale brillante entourée de diamants plus petits. Cette pièce exquise est parfaite pour les fiançailles, les anniversaires ou comme pièce phare qui célèbre les moments spéciaux de la vie.",
  },
  {
    name: 'Montre Minimaliste',
    category: 'Watches',
    price: 179,
    image: '/serpent.jpg',
    images: ['/serpent.jpg', '/MontreSerpent.avif', '/minimalist-watch.png'],
    rating: 4.5,
    description:
      "Une montre minimaliste élégante avec un design de cadran épuré et non encombré. Cette montre incarne la simplicité moderne tout en conservant une fonctionnalité et un style excellents.",
  },
  {
    name: 'Montre Bracelet Cuir',
    category: 'Watches',
    price: 219,
    image: '/leather-watch.png',
    images: ['/leather-watch.png', '/serpent.jpg'],
    rating: 4.5,
    description:
      "Une montre sophistiquée avec un bracelet en cuir premium qui allie confort et style. Le design classique présente un attrait intemporel qui fonctionne à la fois pour les environnements professionnels et décontractés.",
  },
]

async function clearAndReseed() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set')
    }

    if (!process.env.CLOUDINARY_URL) {
      throw new Error('CLOUDINARY_URL environment variable is not set')
    }

    console.log('🔄 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing products
    console.log('🔄 Clearing existing products...')
    await Product.deleteMany({})
    console.log('✅ Cleared existing products')

    // Upload images to Cloudinary and create products
    console.log('🔄 Uploading images to Cloudinary and creating products...')
    const createdProducts = []

    for (const productData of seedProducts) {
      console.log(`\n📦 Processing: ${productData.name}`)
      
      // Upload main image
      console.log(`  📤 Uploading main image: ${productData.image}`)
      const mainImageUrl = await uploadImageToCloudinary(productData.image)
      console.log(`  ✅ Main image URL: ${mainImageUrl}`)

      // Upload additional images
      const additionalImages = productData.images.filter(img => img !== productData.image)
      let imageUrls = [mainImageUrl]
      
      if (additionalImages.length > 0) {
        console.log(`  📤 Uploading ${additionalImages.length} additional images...`)
        const uploadedUrls = await uploadImages(additionalImages)
        imageUrls = [mainImageUrl, ...uploadedUrls]
      }

      // Create product with Cloudinary URLs
      const product = await Product.create({
        name: productData.name,
        category: productData.category,
        price: productData.price,
        image: mainImageUrl,
        images: imageUrls,
        rating: productData.rating,
        description: productData.description,
      })

      createdProducts.push(product)
      console.log(`  ✅ Product created with ID: ${product._id}`)
    }

    console.log(`\n✅ Successfully created ${createdProducts.length} products with Cloudinary URLs`)

    console.log('\n📦 Products created:')
    createdProducts.forEach((product) => {
      console.log(`   - ${product.name} (${product.category}) - ${product.price} MAD`)
      console.log(`     Main image: ${product.image}`)
    })

    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

clearAndReseed()

