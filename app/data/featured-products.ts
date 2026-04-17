import sql from "@/lib/db"

export interface Product {
  id: string | number
  slug: string
  image_url: string
  name: string
  category: string
  price: string | number
  on_sale?: boolean
  sale_price?: number | string | null
  [key: string]: unknown
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const products = await sql`
      SELECT * FROM products
      WHERE destacado = true
        AND stock > 0
      ORDER BY created_at DESC
      LIMIT 8
    `
    return products as Product[]
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
}

export async function getNewProducts(): Promise<Product[]> {
  try {
    const products = await sql`
      SELECT * FROM products
      WHERE new = true
        AND stock > 0
      ORDER BY created_at DESC
      LIMIT 8
    `
    return products as Product[]
  } catch (error) {
    console.error("Error fetching new products:", error)
    return []
  }
}