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

  return (
    <>
      {/* SIZE SELECTOR */}
      {product.variants && product.variants.length > 0 ? (
        <SizeSelector 
          variants={product.variants}
          onSizeSelect={handleSizeSelect}
        />
      ) : (
        <div className="border-b border-highlight/20 pb-6">
          <p className="text-gray-400 text-sm">Sin talles disponibles</p>
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
        />
      </div>
    </>
  )
}