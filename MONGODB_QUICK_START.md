# MongoDB Quick Start - Step by Step

## ✅ What's Been Set Up

All the code has been created! Here's what you need to do now:

## Step 1: Get MongoDB Connection String

### Option A: MongoDB Atlas (Free Cloud Database - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for free account
3. Create a free cluster (takes 3-5 minutes)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (replace `<password>` with your password)
   - Example: `mongodb+srv://username:yourpassword@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority`

### Option B: Local MongoDB
1. Download MongoDB Community: https://www.mongodb.com/try/download/community
2. Install and start MongoDB
3. Use: `mongodb://localhost:27017/ecommerce`

## Step 2: Create .env.local File

1. In the `ecomWeb` folder, create a new file called `.env.local`
2. Add this line (replace with your actual connection string):

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
```

**⚠️ Important:** 
- Never commit `.env.local` to git (it should be in .gitignore)
- For MongoDB Atlas, go to "Network Access" and add your IP address (or use `0.0.0.0/0` for development)

## Step 3: Seed Your Database

Run this command to add your products to MongoDB:

```bash
npm run seed
```

You should see:
```
✅ Connected to MongoDB
✅ Cleared existing products
✅ Successfully seeded 7 products
```

## Step 4: Test It Works

Start your dev server:

```bash
npm run dev
```

Then visit: http://localhost:3000/api/products

You should see JSON data with all your products!

## Step 5: Update Your Pages (Optional - Can Do Later)

Your pages currently use static data. To use the database, update imports:

**Before:**
```typescript
import { PRODUCTS, getProductById } from '@/lib/products'
```

**After (for Server Components):**
```typescript
import { getProducts, getProductById } from '@/lib/products-api'

// In async function
const products = await getProducts()
```

**For Client Components:**
```typescript
'use client'
import { useEffect, useState } from 'react'
import { getProducts, type Product } from '@/lib/products-api'

const [products, setProducts] = useState<Product[]>([])

useEffect(() => {
  getProducts().then(setProducts)
}, [])
```

## What's Available Now

### API Endpoints (all working):
- `GET /api/products` - Get all products
- `GET /api/products?category=Watches` - Filter by category
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get single order
- `PUT /api/orders/[id]` - Update order
- `DELETE /api/orders/[id]` - Delete order

### Files Created:
- `lib/mongodb.ts` - Database connection
- `models/Product.ts` - Product schema
- `models/Order.ts` - Order schema
- `app/api/products/route.ts` - Products API
- `app/api/products/[id]/route.ts` - Single product API
- `app/api/orders/route.ts` - Orders API
- `app/api/orders/[id]/route.ts` - Single order API
- `lib/products-api.ts` - Helper functions to fetch from API
- `scripts/seed.ts` - Seed script

## Troubleshooting

**"MONGODB_URI environment variable is not set"**
→ Create `.env.local` file with `MONGODB_URI=your_connection_string`

**"Connection timeout" (Atlas)**
→ Check Network Access in Atlas, add your IP address

**"Products not showing"**
→ Run `npm run seed` to populate database

**TypeScript errors**
→ Run `npm install` to ensure all dependencies are installed

## Next Steps

1. ✅ Set up MongoDB connection string
2. ✅ Run seed script
3. ✅ Test API endpoints
4. 🔄 Update frontend pages to use API (optional - can keep static for now)
5. 🔄 Add authentication (replace localStorage admin auth)
6. 🔄 Add error handling and loading states

You're all set! 🎉

