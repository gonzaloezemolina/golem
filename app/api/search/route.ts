import { NextResponse } from "next/server"
import sql from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.length < 2) {
      return NextResponse.json([])
    }

    // Buscar productos (máximo 5 sugerencias)
    const products = await sql`
      SELECT id, name, slug, price, image_url, category, brand
      FROM products
      WHERE name ILIKE ${'%' + query + '%'}
         OR brand ILIKE ${'%' + query + '%'}
         OR category ILIKE ${'%' + query + '%'}
      ORDER BY 
        CASE 
          WHEN name ILIKE ${query + '%'} THEN 1
          WHEN name ILIKE ${'%' + query + '%'} THEN 2
          ELSE 3
        END,
        created_at DESC
      LIMIT 5
    `

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error en búsqueda:", error)
    return NextResponse.json([])
  }
}