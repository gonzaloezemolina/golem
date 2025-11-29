"use client"

import { useState } from "react"

interface ProductVariant {
  id: number
  size: string
  stock: number
  sku: string
  is_active: boolean
}

interface SizeSelectorProps {
  variants: ProductVariant[]
  onSizeSelect: (variant: ProductVariant | null) => void
}

// Definir TODOS los talles posibles según tipo de producto
const ALL_CLOTHING_SIZES = ['S', 'M', 'L', 'XL', 'XXL']
const ALL_SHOE_SIZES = ['38', '39', '40', '41', '42', '43', '44', '45', '46']

export default function SizeSelector({ variants, onSizeSelect }: SizeSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)

  // Detectar si es ropa o calzado basándose en los talles que tiene
  const isShoe = variants.some(v => !isNaN(Number(v.size)))
  const allSizes = isShoe ? ALL_SHOE_SIZES : ALL_CLOTHING_SIZES

  // Crear mapa de talles disponibles
  const variantsMap = new Map(variants.map(v => [v.size, v]))

  const handleSizeClick = (size: string) => {
    const variant = variantsMap.get(size)
    
    // Si el talle no existe o no tiene stock, no hacer nada
    if (!variant || variant.stock === 0 || !variant.is_active) {
      return
    }

    setSelectedVariant(variant)
    onSizeSelect(variant)
  }

  return (
    <div className="border-b border-highlight/20 pb-6">
      <div className="flex items-center justify-between mb-4">
        <label className="text-sm font-semibold">Talle</label>
        <button className="text-xs text-highlight hover:text-highlight/80">
          Guía de talles
        </button>
      </div>

      {/* Grid de talles */}
      <div className="grid grid-cols-5 md:grid-cols-6 gap-2">
        {allSizes.map((size) => {
          const variant = variantsMap.get(size)
          const isSelected = selectedVariant?.size === size
          const hasStock = variant && variant.stock > 0 && variant.is_active
          const isDisabled = !hasStock

          return (
            <button
              key={size}
              onClick={() => handleSizeClick(size)}
              disabled={isDisabled}
              className={`
                relative py-2 px-3 border rounded text-sm font-medium transition-all
                ${isSelected 
                  ? "border-highlight bg-highlight/10 text-highlight" 
                  : isDisabled
                  ? "border-gray-700 text-gray-600 cursor-not-allowed line-through opacity-50"
                  : "border-highlight/20 text-white hover:border-highlight"
                }
              `}
            >
              {size}
              
              {/* Badge de stock bajo (solo si tiene stock y no está seleccionado) */}
              {hasStock && variant.stock <= 3 && !isSelected && (
                <span className="absolute -top-1 -right-1 bg-highlight text-black text-[9px] font-bold px-1 rounded">
                  {variant.stock}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Información del talle seleccionado - SIMPLIFICADO */}
      {selectedVariant ? (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Talle seleccionado: <span className="text-highlight font-semibold">{selectedVariant.size}</span>
          </p>
        </div>
      ) : (
        <p className="mt-4 text-sm text-gray-400 text-center">
          Seleccioná un talle para continuar
        </p>
      )}

      {/* Sin stock */}
      {variants.every(v => v.stock === 0) && (
        <p className="mt-4 text-sm text-highlight text-center font-semibold">
          Sin stock disponible
        </p>
      )}
    </div>
  )
}