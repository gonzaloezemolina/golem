import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import sql from "@/lib/db"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params
    const { status } = await request.json()

    // Validar status
    const validStatuses = ["pending", "approved", "rejected"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 })
    }

    // Actualizar orden
    await sql`
      UPDATE orders
      SET status = ${status}
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error al actualizar estado:", error)
    return NextResponse.json(
      { error: "Error al actualizar estado" },
      { status: 500 }
    )
  }
}