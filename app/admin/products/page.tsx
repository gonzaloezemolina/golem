import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import sql from "@/lib/db"
import ProductsTable from "@/components/admin/products-table"
import Link from "next/link"
import { Plus } from "lucide-react"

interface SearchParams {
  category?: string
  search?: string
}

interface Product {
  id: number
  slug: string
  name: string
  price: string
  stock: number
  image_url: string | null
  category: string | null
  brand: string | null
  created_at: Date
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/auth/login")
  }

  const params = await searchParams
  const categoryFilter = params.category
  const searchQuery = params.search

  // Query dinámica
  let products: Product[]

  if (categoryFilter && searchQuery) {
    products = await sql`
      SELECT * FROM products
      WHERE category = ${categoryFilter}
        AND name ILIKE ${'%' + searchQuery + '%'}
      ORDER BY created_at DESC
    ` as Product[]
  } else if (categoryFilter) {
    products = await sql`
      SELECT * FROM products
      WHERE category = ${categoryFilter}
      ORDER BY created_at DESC
    ` as Product[]
  } else if (searchQuery) {
    products = await sql`
      SELECT * FROM products
      WHERE name ILIKE ${'%' + searchQuery + '%'}
      ORDER BY created_at DESC
    ` as Product[]
  } else {
    products = await sql`
      SELECT * FROM products
      ORDER BY created_at DESC
    ` as Product[]
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Productos</h1>
          <p className="text-gray-400">Gestiona el catálogo completo</p>
        </div>
        
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-6 py-3 bg-[#d3b05c] text-black font-bold rounded-lg hover:bg-[#e6c570] transition-colors"
        >
          <Plus size={20} />
          Nuevo Producto
        </Link>
      </div>

      <ProductsTable products={products} />
    </div>
  )
}