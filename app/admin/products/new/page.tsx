import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import sql from "@/lib/db"
import ProductForm from "@/components/admin/product-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface Category {
  id: number
  name: string
  slug: string
}

interface Subcategory {
  id: number
  category_id: number
  name: string
  slug: string
}

export default async function NewProductPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/auth/login")
  }

  // Obtener categorías y subcategorías con cast
  const categories = await sql`SELECT * FROM categories ORDER BY name ASC` as Category[]
  const subcategories = await sql`SELECT * FROM subcategories ORDER BY name ASC` as Subcategory[]

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Volver a productos
        </Link>
        
        <h1 className="text-4xl font-bold mb-2">Nuevo Producto</h1>
        <p className="text-gray-400">Completa la información del producto</p>
      </div>

      <ProductForm categories={categories} subcategories={subcategories} />
    </div>
  )
}