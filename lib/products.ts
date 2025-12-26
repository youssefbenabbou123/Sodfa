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

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Montre Chronographe Élégante",
    category: "Watches",
    price: 299,
    image: "/serpent.jpg",
    images: ["/serpent.jpg", "/MontreSerpent.avif", "/leather-watch.png"],
    rating: 5,
    description: "Une montre chronographe sophistiquée alliant un design classique à une fonctionnalité moderne. Cette élégante montre combine une ingénierie de précision avec un style intemporel, en faisant l'accessoire parfait pour toute occasion.",
  },
  {
    id: "2",
    name: "Collier Chaîne en Or",
    category: "Necklaces",
    price: 199,
    image: "/necklase.avif",
    images: ["/necklase.avif", "/gold-chain-necklace.jpg"],
    rating: 4.5,
    description: "Un magnifique collier chaîne en or qui ajoute de l'élégance à toute tenue. Fabriqué avec attention aux détails, cette pièce présente un design délicat mais durable qui complète à la fois les tenues décontractées et formelles.",
  },
  {
    id: "3",
    name: "Bracelet en Argent",
    category: "Bracelets",
    price: 149,
    image: "/braclet.webp",
    images: ["/braclet.webp", "/silver-bracelet.png"],
    rating: 4,
    description: "Un bracelet en argent magnifiquement travaillé avec des détails complexes. Cette pièce polyvalente peut être portée seule pour un look minimaliste ou empilée avec d'autres bracelets pour un effet plus dramatique.",
  },
  {
    id: "4",
    name: "Boucles d'Oreilles Perles Tombantes",
    category: "Earrings",
    price: 129,
    image: "/earrings.jpg",
    images: ["/earrings.jpg", "/pearl-earrings.png"],
    rating: 5,
    description: "Des boucles d'oreilles perles tombantes élégantes qui dégagent sophistication et grâce. Ces pièces intemporelles présentent des perles lustrées suspendues à des montures en or délicates, parfaites pour les occasions spéciales ou l'élégance quotidienne.",
  },
  {
    id: "5",
    name: "Bague Diamant",
    category: "Rings",
    price: 499,
    image: "/Ring.webp",
    images: ["/Ring.webp", "/sparkling-diamond-ring.png"],
    rating: 5,
    description: "Une bague diamant à couper le souffle avec une pierre centrale brillante entourée de diamants plus petits. Cette pièce exquise est parfaite pour les fiançailles, les anniversaires ou comme pièce phare qui célèbre les moments spéciaux de la vie.",
  },
  {
    id: "6",
    name: "Montre Minimaliste",
    category: "Watches",
    price: 179,
    image: "/serpent.jpg",
    images: ["/serpent.jpg", "/MontreSerpent.avif", "/minimalist-watch.png"],
    rating: 4.5,
    description: "Une montre minimaliste élégante avec un design de cadran épuré et non encombré. Cette montre incarne la simplicité moderne tout en conservant une fonctionnalité et un style excellents.",
  },
  {
    id: "7",
    name: "Montre Bracelet Cuir",
    category: "Watches",
    price: 219,
    image: "/leather-watch.png",
    images: ["/leather-watch.png", "/serpent.jpg"],
    rating: 4.5,
    description: "Une montre sophistiquée avec un bracelet en cuir premium qui allie confort et style. Le design classique présente un attrait intemporel qui fonctionne à la fois pour les environnements professionnels et décontractés.",
  },
]

export const CATEGORIES = ["Tout", "Montres", "Colliers", "Bracelets", "Boucles d'oreilles", "Bagues"]

export function getProductsByCategory(category: string): Product[] {
  if (category === "All" || category === "Tout") {
    return PRODUCTS
  }
  // Map French category names to English for filtering
  const categoryMap: Record<string, string> = {
    "Montres": "Watches",
    "Colliers": "Necklaces",
    "Bracelets": "Bracelets",
    "Boucles d'oreilles": "Earrings",
    "Bagues": "Rings"
  }
  const englishCategory = categoryMap[category] || category
  return PRODUCTS.filter((p) => p.category === englishCategory || p.category === category)
}

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

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

