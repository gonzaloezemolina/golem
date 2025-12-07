import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
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

interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: string
  stock: number
  category_id: number
  subcategory_id: number
  brand: string
  color: string
  image_url: string | null
  image_2: string | null
  image_3: string | null
  image_4: string | null
  image_5: string | null
}

interface Variant {
  id: number
  size: string
  stock: number
  sku: string
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/auth/login")
  }

  const { id } = await params

  // Obtener producto con cast
  const products = await sql`
    SELECT * FROM products WHERE id = ${id}
  ` as Product[]
  
  const product = products[0]

  if (!product) {
    notFound()
  }

  // Obtener variantes con cast
  const variants = await sql`
    SELECT * FROM product_variants 
    WHERE product_id = ${id}
    ORDER BY size ASC
  ` as Variant[]

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
        
        <h1 className="text-4xl font-bold mb-2">Editar Producto</h1>
        <p className="text-gray-400">{product.name}</p>
      </div>

      <ProductForm 
        product={product} 
        variants={variants}
        categories={categories} 
        subcategories={subcategories} 
      />
    </div>
  )
}