import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import sql from "@/lib/db"
import OrdersTable from "@/components/admin/orders-table"

interface SearchParams {
  status?: string
  search?: string
}

interface Order {
  id: number
  buyer_name: string
  buyer_email: string
  total: string
  status: string
  created_at: Date
  shipping_type: string
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/auth/login")
  }

  const params = await searchParams
  const statusFilter = params.status
  const searchQuery = params.search

  // Construir query dinámica
  let orders: Order[]

  if (statusFilter && searchQuery) {
    orders = await sql`
      SELECT * FROM orders
      WHERE status = ${statusFilter}
        AND (buyer_name ILIKE ${'%' + searchQuery + '%'} 
        OR buyer_email ILIKE ${'%' + searchQuery + '%'})
      ORDER BY created_at DESC
    ` as Order[]
  } else if (statusFilter) {
    orders = await sql`
      SELECT * FROM orders
      WHERE status = ${statusFilter}
      ORDER BY created_at DESC
    ` as Order[]
  } else if (searchQuery) {
    orders = await sql`
      SELECT * FROM orders
      WHERE buyer_name ILIKE ${'%' + searchQuery + '%'}
        OR buyer_email ILIKE ${'%' + searchQuery + '%'}
      ORDER BY created_at DESC
    ` as Order[]
  } else {
    orders = await sql`
      SELECT * FROM orders
      ORDER BY created_at DESC
    ` as Order[]
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Órdenes</h1>
        <p className="text-gray-400">Gestiona todas las órdenes del ecommerce</p>
      </div>

      <OrdersTable orders={orders} />
    </div>
  )
}