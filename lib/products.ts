/**
 * Product types and helper functions
 * NOTE: Products are now stored in MongoDB. Use products-api.ts to fetch products from the API.
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

export const CATEGORIES = ["Tout", "Montres", "Colliers", "Bracelets", "Boucles d'oreilles", "Bagues"]

// Category mapping helper
export function getCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    "All": "Tout",
    "Watches": "Montres",
    "Necklaces": "Colliers",
    "Bracelets": "Bracelets",
    "Earrings": "Boucles d'oreilles",
    "Rings": "Bagues",
    "Tout": "Tout",
    "Montres": "Montres",
    "Colliers": "Colliers",
    "Boucles d'oreilles": "Boucles d'oreilles",
    "Bagues": "Bagues"
  }
  return categoryMap[category] || category
}
