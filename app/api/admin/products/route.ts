import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import sql from "@/lib/db"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const data = await request.json()

    // Crear producto SIN especificar ID (se autogenera)
    const [product] = await sql`
      INSERT INTO products (
        name, slug, description, price, stock,
        category_id, subcategory_id, brand, color,
        image_url, image_2, image_3, image_4, image_5
      ) VALUES (
        ${data.name}, 
        ${data.slug}, 
        ${data.description}, 
        ${data.price}, 
        ${data.variants.length > 0 ? 0 : data.stock},
        ${data.category_id}, 
        ${data.subcategory_id || null}, 
        ${data.brand || null}, 
        ${data.color || null},
        ${data.image_url || null}, 
        ${data.image_2 || null}, 
        ${data.image_3 || null}, 
        ${data.image_4 || null}, 
        ${data.image_5 || null}
      )
      RETURNING id
    `

    // Crear variantes si existen
    if (data.variants && data.variants.length > 0) {
      for (const variant of data.variants) {
        await sql`
          INSERT INTO product_variants (product_id, size, stock, sku)
          VALUES (${product.id}, ${variant.size}, ${variant.stock}, ${variant.sku || null})
        `
      }
    }

    return NextResponse.json({ success: true, id: product.id })
  } catch (error: any) {
    console.error("Error al crear producto:", error)
    return NextResponse.json(
      { error: error.message || "Error al crear producto" },
      { status: 500 }
    )
  }
}