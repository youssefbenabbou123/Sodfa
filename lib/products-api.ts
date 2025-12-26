/**
 * API-based product utilities
 * This file provides functions to fetch products from the API instead of static data
 */

export interface Product {
  id: string
  name: string
  category: string
  price: number
  image: string
  images?: string[]
  rating: number
  description?: string
}

// Helper function to fetch from API
async function fetchAPI<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(endpoint, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API Error (${response.status}):`, errorText)
      throw new Error(`Failed to fetch: ${response.statusText}`)
    }
    
    const data = await response.json()
    if (!data.success) {
      console.error('API returned error:', data)
      throw new Error(data.error || 'API request failed')
    }
    return data.data
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}

// Fetch all products (optionally filtered by category)
export async function getProducts(category?: string): Promise<Product[]> {
  try {
    const endpoint = category && category !== 'Tout' && category !== 'All'
      ? `/api/products?category=${encodeURIComponent(category)}`
      : '/api/products'
    
    return await fetchAPI<Product[]>(endpoint)
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

// Fetch single product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    return await fetchAPI<Product>(`/api/products/${id}`)
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

// Get products by category (maps French category names to English for API)
export async function getProductsByCategory(category: string): Promise<Product[]> {
  if (category === 'All' || category === 'Tout') {
    return getProducts()
  }
  
  // Map French category names to English for API filtering
  const categoryMap: Record<string, string> = {
    'Montres': 'Watches',
    'Colliers': 'Necklaces',
    'Bracelets': 'Bracelets',
    "Boucles d'oreilles": 'Earrings',
    'Bagues': 'Rings',
  }
  
  const englishCategory = categoryMap[category] || category
  return getProducts(englishCategory)
}

// Category mapping helper (kept for compatibility)
export function getCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    'All': 'Tout',
    'Watches': 'Montres',
    'Necklaces': 'Colliers',
    'Bracelets': 'Bracelets',
    'Earrings': "Boucles d'oreilles",
    'Rings': 'Bagues',
    'Tout': 'Tout',
    'Montres': 'Montres',
    'Colliers': 'Colliers',
    "Boucles d'oreilles": "Boucles d'oreilles",
    'Bagues': 'Bagues',
  }
  return categoryMap[category] || category
}

export const CATEGORIES = ['Tout', 'Montres', 'Colliers', 'Bracelets', "Boucles d'oreilles", 'Bagues']

