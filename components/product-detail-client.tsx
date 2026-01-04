"use client"

import { useState } from "react"
import SizeSelector from "./size-selector"
import AddToCartButton from "./addToCartButton"

interface ProductVariant {
  id: number
  size: string
  stock: number
  sku: string
  is_active: boolean
}

interface Product {
  id: number
  name: string
  price: number
  slug: string
  image_url: string | null
  brand: string | null
  description: string | null
  stock: number // ← IMPORTANTE: stock del producto
  variants?: ProductVariant[]
  total_stock?: number
  available_sizes?: string[]
}

interface ProductDetailClientProps {
  product: Product
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)

  const handleSizeSelect = (variant: ProductVariant | null) => {
    setSelectedVariant(variant)
  }

  const hasVariants = (product.variants?.length ?? 0) > 0

  return (
    <>
      {/* SIZE SELECTOR - Solo si hay variantes */}
      {hasVariants ? (
        <SizeSelector 
          variants={product.variants!}
          onSizeSelect={handleSizeSelect}
        />
      ) : (
        // Producto SIN variantes - Mostrar solo el stock ACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
        <div className="border-b border-highlight/20 pb-6">
          <p className="text-sm text-gray-400">
            Stock disponible: <strong className="text-white">{product.stock}</strong> unidades
          </p>
        </div>
      )}

      {/* Product Description */}
      {product.description && (
        <div className="border-b border-highlight/20 pb-6">
          <p className="text-gray-300 leading-relaxed">{product.description}</p>
        </div>
      )}

      {/* Add to Cart */}
      <div className="flex gap-3">
        <AddToCartButton 
          product={product} 
          selectedVariant={selectedVariant}
          hasVariants={hasVariants} // ← NUEVO
        />
      </div>
    </>
  )
}