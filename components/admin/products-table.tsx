"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search, Filter, Edit, Trash2, Eye } from "lucide-react"

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

interface ProductsTableProps {
  products: Product[]
}

export default function ProductsTable({ products }: ProductsTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "all")
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (categoryFilter !== "all") params.set("category", categoryFilter)
    router.push(`/admin/products?${params.toString()}`)
  }

  const handleCategoryChange = (category: string) => {
    setCategoryFilter(category)
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (category !== "all") params.set("category", category)
    router.push(`/admin/products?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearch("")
    setCategoryFilter("all")
    router.push("/admin/products")
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar "${name}"?`)) return

    setDeletingId(id)
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert("Error al eliminar el producto")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al eliminar el producto")
    } finally {
      setDeletingId(null)
    }
  }

  // Obtener categorías únicas
  const categories = Array.from(
  new Set(
    products
      .map(p => p.category)
      .filter((cat): cat is string => cat !== null && cat !== undefined)
  )
)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg">
      {/* Filters */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#d3b05c]"
              />
            </div>
          </form>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#d3b05c]"
            >
              <option value="all">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {(search || categoryFilter !== "all") && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-4 mt-4 text-sm">
          <span className="text-gray-400">
            Total: <strong className="text-white">{products.length}</strong> productos
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-400">
            Stock total: <strong className="text-green-500">
              {products.reduce((acc, p) => acc + p.stock, 0)}
            </strong> unidades
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-800">
              <th className="px-6 py-4 text-sm font-semibold text-gray-400">Producto</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-400">Categoría</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-400">Marca</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-400">Precio</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-400">Stock</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-400">Creado</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  No se encontraron productos
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                            Sin img
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold line-clamp-1">{product.name}</p>
                        <p className="text-xs text-gray-400 line-clamp-1">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded text-xs font-semibold">
                      {product.category || 'Sin categoría'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {product.brand || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-[#d3b05c]">
                      ${parseFloat(product.price).toLocaleString('es-AR')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`
                      px-2 py-1 rounded text-xs font-semibold
                      ${product.stock > 10 
                        ? 'bg-green-500/10 text-green-500' 
                        : product.stock > 0 
                        ? 'bg-yellow-500/10 text-yellow-500' 
                        : 'bg-red-500/10 text-red-500'
                      }
                    `}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(product.created_at).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/products/${product.slug}`}
                        className="p-2 bg-blue-500/10 text-blue-500 rounded hover:bg-blue-500/20 transition-colors"
                        title="Ver en tienda"
                      >
                        <Eye size={16} />
                      </Link>
                      
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-2 bg-[#d3b05c]/10 text-[#d3b05c] rounded hover:bg-[#d3b05c]/20 transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </Link>
                      
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deletingId === product.id}
                        className="p-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 transition-colors disabled:opacity-50"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination placeholder */}
      {products.length > 0 && (
        <div className="p-4 border-t border-gray-800 flex items-center justify-between text-sm text-gray-400">
          <span>Mostrando {products.length} productos</span>
          <span>Paginación próximamente</span>
        </div>
      )}
    </div>
  )
}