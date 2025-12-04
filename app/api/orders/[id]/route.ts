import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [order] = await sql`
      SELECT * FROM orders WHERE id = ${id}
    `;

    if (!order) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 }
      );
    }

    const items = await sql`
      SELECT oi.*, p.name 
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${id}
    `;

    return NextResponse.json({
      ...order,
      items,
    });
  } catch (error: any) {
    console.error("Error al obtener orden:", error);
    return NextResponse.json(
      { error: "Error al obtener orden" },
      { status: 500 }
    );
  }
}