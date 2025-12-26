# MongoDB Setup Guide

This guide will walk you through setting up MongoDB for your ecommerce application.

## Step 1: Get MongoDB Connection String

You have two options:

### Option A: MongoDB Atlas (Cloud - Recommended for Production)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (free tier is fine)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority`)
6. Replace `<password>` with your database password

### Option B: Local MongoDB
1. Install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/ecommerce`

## Step 2: Set Up Environment Variables

1. Create a `.env.local` file in the root of `ecomWeb` directory:

```env
MONGODB_URI=your_connection_string_here
```

**Important:** 
- Never commit `.env.local` to git (it's already in .gitignore)
- For MongoDB Atlas, make sure to whitelist your IP address (or use 0.0.0.0/0 for development)

## Step 3: Seed the Database

Run the seed script to populate your database with initial products:

```bash
npm run seed
```

This will:
- Connect to your MongoDB database
- Clear existing products (optional - you can modify the script to skip this)
- Insert all products from your original `products.ts` file

## Step 4: Start Your Development Server

```bash
npm run dev
```

Your API routes are now available at:
- `GET /api/products` - Get all products
- `GET /api/products?category=Watches` - Get products by category
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get single order
- `PUT /api/orders/[id]` - Update order
- `DELETE /api/orders/[id]` - Delete order

## Step 5: Update Your Frontend Code

You can now use the API-based functions from `lib/products-api.ts` instead of static data:

```typescript
// Old way (static)
import { PRODUCTS, getProductById } from '@/lib/products'

// New way (API)
import { getProducts, getProductById } from '@/lib/products-api'

// In a component
const products = await getProducts() // Fetches from API
const product = await getProductById('some-id') // Fetches from API
```

**Note:** For client components, you'll need to use `useEffect` or React Server Components:

```typescript
// Server Component (page.tsx)
import { getProducts } from '@/lib/products-api'

export default async function ShopPage() {
  const products = await getProducts()
  // ...
}

// Client Component
'use client'
import { useEffect, useState } from 'react'
import { getProducts, type Product } from '@/lib/products-api'

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  
  useEffect(() => {
    getProducts().then(setProducts)
  }, [])
  
  // ...
}
```

## Troubleshooting

### Connection Error
- Check your `MONGODB_URI` is correct
- For Atlas, make sure your IP is whitelisted
- Check if MongoDB service is running (for local)

### Products Not Showing
- Run `npm run seed` to populate the database
- Check browser console for API errors
- Verify API routes are working: visit `http://localhost:3000/api/products`

### TypeScript Errors
- Make sure all dependencies are installed: `npm install`
- Check that models are properly imported

## Next Steps

1. **Update Frontend Pages**: Replace static product imports with API calls
2. **Add Authentication**: Implement proper admin authentication (currently uses localStorage)
3. **Add Error Handling**: Add proper error boundaries and loading states
4. **Add Validation**: Add input validation for API requests
5. **Add Caching**: Consider adding Redis or Next.js cache for better performance

