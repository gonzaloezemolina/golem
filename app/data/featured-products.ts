import sql from "@/lib/db"

export async function getFeaturedProducts() {
  try {
    const products = await sql`
      SELECT * FROM products 
      WHERE destacado = true 
        AND stock > 0
      ORDER BY created_at DESC
      LIMIT 8
    `
    return products
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
}

export async function getNewProducts() {
  try {
    const products = await sql`
      SELECT * FROM products 
      WHERE new = true 
        AND stock > 0
      ORDER BY created_at DESC
      LIMIT 8
    `
    return products
  } catch (error) {
    console.error("Error fetching new products:", error)
    return []
  }
}