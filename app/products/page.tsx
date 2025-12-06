import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Suspense } from "react"
import sql from "@/lib/db"

interface Product {
  id: number
  slug: string
  name: string
  price: number
  image_url: string | null
  category: string | null
  stock: number
}

interface SearchParams {
  category_id?: string
  subcategory_id?: string
  min_price?: string
  max_price?: string
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  
  // Convertir params a números
  const categoryId = params.category_id ? parseInt(params.category_id) : undefined
  const subcategoryId = params.subcategory_id ? parseInt(params.subcategory_id) : undefined
  const minPrice = params.min_price ? parseFloat(params.min_price) : undefined
  const maxPrice = params.max_price ? parseFloat(params.max_price) : undefined
  
  // Obtener productos con filtros
 let products: Product[] = []

// Todos los filtros
if (categoryId && subcategoryId && minPrice && maxPrice) {
  products = await sql`
    SELECT * FROM products 
    WHERE category_id = ${categoryId} 
      AND subcategory_id = ${subcategoryId}
      AND price >= ${minPrice}
      AND price <= ${maxPrice}
    ORDER BY created_at DESC
  ` as Product[]
} 
// Categoría + Subcategoría + Solo Máximo
else if (categoryId && subcategoryId && maxPrice) {
  products = await sql`
    SELECT * FROM products 
    WHERE category_id = ${categoryId} 
      AND subcategory_id = ${subcategoryId}
      AND price <= ${maxPrice}
    ORDER BY created_at DESC
  ` as Product[]
} 
// Categoría + Subcategoría + Solo Mínimo
else if (categoryId && subcategoryId && minPrice) {
  products = await sql`
    SELECT * FROM products 
    WHERE category_id = ${categoryId} 
      AND subcategory_id = ${subcategoryId}
      AND price >= ${minPrice}
    ORDER BY created_at DESC
  ` as Product[]
}
// Categoría + Subcategoría (sin precio)
else if (categoryId && subcategoryId) {
  products = await sql`
    SELECT * FROM products 
    WHERE category_id = ${categoryId} AND subcategory_id = ${subcategoryId}
    ORDER BY created_at DESC
  ` as Product[]
} 
// Categoría + Precios
else if (categoryId && minPrice && maxPrice) {
  products = await sql`
    SELECT * FROM products 
    WHERE category_id = ${categoryId}
      AND price >= ${minPrice}
      AND price <= ${maxPrice}
    ORDER BY created_at DESC
  ` as Product[]
}
// Categoría + Solo Máximo
else if (categoryId && maxPrice) {
  products = await sql`
    SELECT * FROM products 
    WHERE category_id = ${categoryId}
      AND price <= ${maxPrice}
    ORDER BY created_at DESC
  ` as Product[]
}
// Categoría + Solo Mínimo
else if (categoryId && minPrice) {
  products = await sql`
    SELECT * FROM products 
    WHERE category_id = ${categoryId}
      AND price >= ${minPrice}
    ORDER BY created_at DESC
  ` as Product[]
}
// Solo Categoría
else if (categoryId) {
  products = await sql`
    SELECT * FROM products 
    WHERE category_id = ${categoryId}
    ORDER BY created_at DESC
  ` as Product[]
} 
// Solo Precios (ambos)
else if (minPrice && maxPrice) {
  products = await sql`
    SELECT * FROM products 
    WHERE price >= ${minPrice} AND price <= ${maxPrice}
    ORDER BY created_at DESC
  ` as Product[]
} 
// Solo Mínimo
else if (minPrice) {
  products = await sql`
    SELECT * FROM products 
    WHERE price >= ${minPrice}
    ORDER BY created_at DESC
  ` as Product[]
} 
// Solo Máximo
else if (maxPrice) {
  products = await sql`
    SELECT * FROM products 
    WHERE price <= ${maxPrice}
    ORDER BY created_at DESC
  ` as Product[]
} 
// Sin filtros
else {
  products = await sql`
    SELECT * FROM products 
    ORDER BY created_at DESC
  ` as Product[]
}

  if (!products || products.length === 0) {
    return (
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Catálogo</h1>
          <p className="text-gray-400">0 productos disponibles</p>
        </div>
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">No hay productos que coincidan con tus filtros.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">CATÁLOGO</h1>
        <p className="text-gray-400">{products.length} productos disponibles</p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="group  hover:border-highlight/60 transition-all duration-300 overflow-hidden relative"
          >
            <Link href={`/products/${product.slug}`}>
              <div className="relative h-64 md:h-72 bg-transparent overflow-hidden">
                <Image
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* <button className="absolute bottom-4 right-4 p-3 bg-highlight text-black rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-highlight/80 transform group-hover:translate-y-0 translate-y-2">
                  <ShoppingCart size={20} />
                </button> */}
              </div>
              
           

            <div className="p-4 md:p-6">
              <p className="text-highlight text-sm font-semibold mb-2">{product.category}</p>
              <h3 className="text-lg md:text-xl font-bold mb-3 group-hover:text-highlight transition-colors line-clamp-2">
                {product.name}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-highlight">
                  ${parseFloat(product.price.toString())}
                </span>
              </div>
            </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}