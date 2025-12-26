import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'

// GET all orders
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching orders from MongoDB...')
    await connectDB()
    console.log('✅ Connected to MongoDB')
    
    const orders = await Order.find().sort({ createdAt: -1 }).lean()
    console.log(`✅ Found ${orders.length} orders`)
    
    const formattedOrders = orders.map((order: any) => ({
      id: order._id.toString(),
      customerName: order.customerName,
      phone: order.phone,
      city: order.city,
      address: order.address,
      items: order.items,
      total: order.total,
      status: order.status,
      date: order.createdAt,
    }))
    
    return NextResponse.json({ success: true, data: formattedOrders })
  } catch (error: any) {
    console.error('❌ Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST create new order
export async function POST(request: NextRequest) {
  try {
    console.log('📦 Creating new order in MongoDB...')
    await connectDB()
    console.log('✅ Connected to MongoDB')
    
    const body = await request.json()
    console.log('📝 Order data:', JSON.stringify(body, null, 2))
    
    const order = await Order.create(body)
    console.log('✅ Order created:', order._id.toString())
    
    return NextResponse.json(
      {
        success: true,
        data: {
          id: order._id.toString(),
          customerName: order.customerName,
          phone: order.phone,
          city: order.city,
          address: order.address,
          items: order.items,
          total: order.total,
          status: order.status,
          date: order.createdAt,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('❌ Error creating order:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

