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

    // VALIDACIÓN: Verificar que category_id no sea 0
    if (!data.category_id || data.category_id === 0) {
      return NextResponse.json(
        { error: "Debe seleccionar una categoría" },
        { status: 400 }
      )
    }

       // ⭐ OBTENER NOMBRE DE LA SUBCATEGORÍA (si existe)
    let categoryName = null
    
    if (data.subcategory_id && data.subcategory_id !== 0) {
      // Si tiene subcategoría, usar el nombre de la subcategoría
      const [subcategory] = await sql`
        SELECT name FROM subcategories WHERE id = ${data.subcategory_id}
      `
      if (subcategory) {
        categoryName = subcategory.name
      }
    }
    
    // Si no tiene subcategoría, usar el nombre de la categoría padre
    if (!categoryName) {
      const [category] = await sql`
        SELECT name FROM categories WHERE id = ${data.category_id}
      `
      if (category) {
        categoryName = category.name
      }
    }

    if (!categoryName) {
      return NextResponse.json(
        { error: "Categoría no encontrada" },
        { status: 400 }
      )
    }

    console.log("📦 Category name para guardar:", categoryName)

    // Calcular stock total
    const totalStock = data.variants && data.variants.length > 0
      ? data.variants.reduce((sum: number, v: any) => sum + (parseInt(v.stock) || 0), 0)
      : parseInt(data.stock) || 0

    // Crear producto
    const [product] = await sql`
      INSERT INTO products (
        name, slug, description, price, stock, category,
        category_id, subcategory_id, brand, color,
        image_url, image_2, image_3, image_4, image_5
      ) VALUES (
        ${data.name}, 
        ${data.slug}, 
        ${data.description}, 
        ${data.price}, 
        ${totalStock},
        ${categoryName},
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