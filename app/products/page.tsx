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
  search?: string // ← NUEVO
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  
  // Convertir params
  const categoryId = params.category_id ? parseInt(params.category_id) : undefined
  const subcategoryId = params.subcategory_id ? parseInt(params.subcategory_id) : undefined
  const minPrice = params.min_price ? parseFloat(params.min_price) : undefined
  const maxPrice = params.max_price ? parseFloat(params.max_price) : undefined
  const searchQuery = params.search || undefined // ← NUEVO
  
  // Query SQL dinámica
  let products: Product[] = []

  // NUEVO: Si hay búsqueda, hacer query simplificada
  if (searchQuery) {
    products = await sql`
      SELECT * FROM products 
      WHERE (
        name ILIKE ${'%' + searchQuery + '%'}
        OR brand ILIKE ${'%' + searchQuery + '%'}
        OR category ILIKE ${'%' + searchQuery + '%'}
      )
      AND stock > 0
      ${categoryId ? sql`AND category_id = ${categoryId}` : sql``}
      ${subcategoryId ? sql`AND subcategory_id = ${subcategoryId}` : sql``}
      ${minPrice ? sql`AND price >= ${minPrice}` : sql``}
      ${maxPrice ? sql`AND price <= ${maxPrice}` : sql``}
      ORDER BY 
        CASE 
          WHEN name ILIKE ${searchQuery + '%'} THEN 1
          WHEN name ILIKE ${'%' + searchQuery + '%'} THEN 2
          ELSE 3
        END,
        created_at DESC
    ` as Product[]
  }
  // Todos los filtros (sin búsqueda)
  else if (categoryId && subcategoryId && minPrice && maxPrice) {
    products = await sql`
      SELECT * FROM products 
      WHERE category_id = ${categoryId} 
        AND subcategory_id = ${subcategoryId}
        AND price >= ${minPrice}
        AND price <= ${maxPrice}
        AND stock > 0
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
        AND stock > 0
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
        AND stock > 0
      ORDER BY created_at DESC
    ` as Product[]
  }
  // Categoría + Subcategoría (sin precio)
  else if (categoryId && subcategoryId) {
    products = await sql`
      SELECT * FROM products 
      WHERE category_id = ${categoryId} AND subcategory_id = ${subcategoryId}
      AND stock > 0
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
        AND stock > 0
      ORDER BY created_at DESC
    ` as Product[]
  }
  // Categoría + Solo Máximo
  else if (categoryId && maxPrice) {
    products = await sql`
      SELECT * FROM products 
      WHERE category_id = ${categoryId}
        AND price <= ${maxPrice}
        AND stock > 0
      ORDER BY created_at DESC
    ` as Product[]
  }
  // Categoría + Solo Mínimo
  else if (categoryId && minPrice) {
    products = await sql`
      SELECT * FROM products 
      WHERE category_id = ${categoryId}
        AND price >= ${minPrice}
        AND stock > 0
      ORDER BY created_at DESC
    ` as Product[]
  }
  // Solo Categoría
  else if (categoryId) {
    products = await sql`
      SELECT * FROM products 
      WHERE category_id = ${categoryId}
      AND stock > 0
      ORDER BY created_at DESC
    ` as Product[]
  } 
  // Solo Precios (ambos)
  else if (minPrice && maxPrice) {
    products = await sql`
      SELECT * FROM products 
      WHERE price >= ${minPrice} AND price <= ${maxPrice}
      AND stock > 0
      ORDER BY created_at DESC
    ` as Product[]
  } 
  // Solo Mínimo
  else if (minPrice) {
    products = await sql`
      SELECT * FROM products 
      WHERE price >= ${minPrice}
      AND stock > 0
      ORDER BY created_at DESC
    ` as Product[]
  } 
  // Solo Máximo
  else if (maxPrice) {
    products = await sql`
      SELECT * FROM products 
      WHERE price <= ${maxPrice}
      AND stock > 0
      ORDER BY created_at DESC
    ` as Product[]
  } 
  // Sin filtros
  else {
    products = await sql`
      SELECT * FROM products
      WHERE stock > 0
      ORDER BY created_at DESC
    ` as Product[]
  }

  // Mensaje personalizado según búsqueda
  const getEmptyMessage = () => {
    if (searchQuery) {
      return `No se encontraron productos para "${searchQuery}"`
    }
    return "No hay productos que coincidan con tus filtros."
  }

  if (!products || products.length === 0) {
    return (
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {searchQuery ? `Resultados para "${searchQuery}"` : "CATÁLOGO"}
          </h1>
          <p className="text-gray-400">0 productos encontrados</p>
        </div>
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">{getEmptyMessage()}</p>
          {searchQuery && (
            <Link href="/products" className="mt-4 inline-block text-highlight hover:underline">
              Ver todos los productos →
            </Link>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {searchQuery ? `Resultados para "${searchQuery}"` : "CATÁLOGO"}
        </h1>
        <p className="text-gray-400">
          {products.length} producto{products.length !== 1 ? 's' : ''} 
          {searchQuery && ' encontrado' + (products.length !== 1 ? 's' : '')}
        </p>
        {searchQuery && (
          <Link href="/products" className="text-sm text-highlight hover:underline mt-2 inline-block">
            ← Limpiar búsqueda
          </Link>
        )}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="group hover:border-highlight/60 transition-all duration-300 overflow-hidden relative"
          >
            <Link href={`/products/${product.slug}`}>
              <div className="relative h-64 md:h-72 bg-transparent overflow-hidden">
                <Image
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4 md:p-6">
                <p className="text-highlight text-sm font-semibold mb-2">{product.category}</p>
                <h3 className="text-lg md:text-xl font-bold mb-3 group-hover:text-highlight transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-highlight">
                    ${parseFloat(product.price.toString()).toLocaleString('es-AR')}
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