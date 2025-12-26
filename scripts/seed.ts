/**
 * Seed script to migrate existing products to MongoDB
 * Run with: npx tsx scripts/seed.ts
 * Or: npm run seed (if added to package.json)
 */

import dotenv from 'dotenv'
import { resolve } from 'path'
import mongoose from 'mongoose'
import Product from '../models/Product'

// Load .env.local file
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI || ''

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

async function seed() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set')
    }

    console.log('🔄 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing products (optional - remove if you want to keep existing data)
    console.log('🔄 Clearing existing products...')
    await Product.deleteMany({})
    console.log('✅ Cleared existing products')

    // Insert seed products
    console.log('🔄 Seeding products...')
    const createdProducts = await Product.insertMany(seedProducts)
    console.log(`✅ Successfully seeded ${createdProducts.length} products`)

    console.log('\n📦 Seeded products:')
    createdProducts.forEach((product) => {
      console.log(`   - ${product.name} (${product.category}) - ${product.price} MAD`)
    })

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seed()

