"use client"

import { useCartStore } from "@/lib/store/cart-store"
import { toast } from 'react-toastify'

interface ProductVariant {
  id: number
  size: string
  stock: number
  sku: string
}

interface AddToCartButtonProps {
  product: any
  selectedVariant: ProductVariant | null
  onAddToCart?: () => void
}

export default function AddToCartButton({ 
  product, 
  selectedVariant,
  onAddToCart 
}: AddToCartButtonProps) {
  const addItem = useCartStore((state: any) => state.addItem)

  const handleAddToCart = () => {
    // Validar que haya talle seleccionado
    if (!selectedVariant) {
      toast.error('Por favor, seleccioná un talle primero', {
        position: "bottom-right",
        autoClose: 2000,
      })
      return
    }

    // Agregar al carrito
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: parseFloat(product.price),
        image_url: product.image_url || undefined,
        brand: product.brand || 'Golem',
        seller_mp_id: product.seller_mp_id || null,
        commission_rate: parseFloat(product.commission_rate) || 0,
        // Agregar info de la variante
        variant_id: selectedVariant.id,
        size: selectedVariant.size,
        sku: selectedVariant.sku,
      },
      1 // Cantidad fija en 1 (lo podés hacer dinámico después)
    )

    // Toast de éxito
    toast.success(
      `${product.name} - Talle ${selectedVariant.size} agregado al carrito`,
      {
        position: "bottom-right",
        autoClose: 3000,
      }
    )

    // Callback opcional
    if (onAddToCart) onAddToCart()
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={!selectedVariant}
      className={`
        flex-1 px-6 py-3 font-bold transition-all
        ${selectedVariant
          ? "bg-highlight text-white hover:bg-[#bc9740] cursor-pointer"
          : "bg-gray-700 text-gray-400 cursor-not-allowed"
        }
      `}
    >
      {selectedVariant ? "AGREGAR AL CARRITO" : "Seleccioná un talle"}
    </button>
  )
}