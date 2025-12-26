import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'

// GET all products
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching products from MongoDB...')
    await connectDB()
    console.log('✅ Connected to MongoDB')
    
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    console.log('📂 Category filter:', category)
    
    let query = {}
    if (category && category !== 'Tout' && category !== 'All') {
      // Map French category names to English
      const categoryMap: Record<string, string> = {
        'Montres': 'Watches',
        'Colliers': 'Necklaces',
        'Bracelets': 'Bracelets',
        "Boucles d'oreilles": 'Earrings',
        'Bagues': 'Rings',
        'Watches': 'Watches',
        'Necklaces': 'Necklaces',
        'Earrings': 'Earrings',
        'Rings': 'Rings',
      }
      const englishCategory = categoryMap[category] || category
      query = { category: { $in: [category, englishCategory] } }
      console.log('🔎 Query:', JSON.stringify(query))
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 }).lean()
    console.log(`✅ Found ${products.length} products`)
    
    // Convert MongoDB _id to id string
    const formattedProducts = products.map((product: any) => ({
      id: product._id.toString(),
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      images: product.images || [],
      rating: product.rating,
      description: product.description,
    }))
    
    return NextResponse.json({ success: true, data: formattedProducts })
  } catch (error: any) {
    console.error('❌ Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST create new product
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    const product = await Product.create(body)
    
    return NextResponse.json(
      {
        success: true,
        data: {
          id: product._id.toString(),
          name: product.name,
          category: product.category,
          price: product.price,
          image: product.image,
          images: product.images || [],
          rating: product.rating,
          description: product.description,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

