import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import sql from "@/lib/db"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    // Después de obtener data
if (!data.category_id || data.category_id === 0) {
  return NextResponse.json(
    { error: "Debe seleccionar una categoría" },
    { status: 400 }
  )
}

    // Calcular stock total
    const totalStock = data.variants && data.variants.length > 0
      ? data.variants.reduce((sum: number, v: any) => sum + (parseInt(v.stock) || 0), 0)
      : parseInt(data.stock) || 0

    // Actualizar producto
    await sql`
      UPDATE products SET
        name = ${data.name},
        slug = ${data.slug},
        description = ${data.description},
        price = ${data.price},
        stock = ${totalStock},
        category_id = ${data.category_id},
        subcategory_id = ${data.subcategory_id || null},
        brand = ${data.brand || null},
        color = ${data.color || null},
        image_url = ${data.image_url || null},
        image_2 = ${data.image_2 || null},
        image_3 = ${data.image_3 || null},
        image_4 = ${data.image_4 || null},
        image_5 = ${data.image_5 || null}
      WHERE id = ${id}
    `

    // Eliminar variantes existentes
    await sql`DELETE FROM product_variants WHERE product_id = ${id}`

    // Crear nuevas variantes
    if (data.variants && data.variants.length > 0) {
      for (const variant of data.variants) {
        await sql`
          INSERT INTO product_variants (product_id, size, stock, sku)
          VALUES (${id}, ${variant.size}, ${variant.stock}, ${variant.sku || null})
        `
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error al actualizar producto:", error)
    return NextResponse.json(
      { error: "Error al actualizar producto" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params

    const orders = await sql`
      SELECT COUNT(*) as count
      FROM order_items
      WHERE product_id = ${id}
    `

    if (orders[0].count > 0) {
      return NextResponse.json(
        { error: "No se puede eliminar: el producto tiene órdenes asociadas" },
        { status: 400 }
      )
    }

    await sql`DELETE FROM product_variants WHERE product_id = ${id}`
    await sql`DELETE FROM products WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error al eliminar producto:", error)
    return NextResponse.json(
      { error: "Error al eliminar producto" },
      { status: 500 }
    )
  }
}