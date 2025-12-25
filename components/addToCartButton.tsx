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
  hasVariants: boolean // ← NUEVO
  onAddToCart?: () => void
}

export default function AddToCartButton({ 
  product, 
  selectedVariant,
  hasVariants, // ← NUEVO
  onAddToCart 
}: AddToCartButtonProps) {
  const addItem = useCartStore((state: any) => state.addItem)

  const handleAddToCart = () => {
    // CASO 1: Producto SIN variantes
    if (!hasVariants) {
      if (product.stock === 0) {
        toast.error('Producto sin stock', {
          position: "bottom-right",
          autoClose: 2000,
        })
        return
      }

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
          variant_id: null,
          size: null,
          sku: null,
          total_stock: product.stock,
        },
        1
      )

      toast.success(`${product.name} agregado al carrito`, {
        position: "bottom-right",
        autoClose: 3000,
      })

      if (onAddToCart) onAddToCart()
      return
    }

    // CASO 2: Producto CON variantes - validar que haya talle seleccionado
    if (!selectedVariant) {
      toast.error('Por favor, seleccioná un talle primero', {
        position: "bottom-right",
        autoClose: 2000,
      })
      return
    }

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
        variant_id: selectedVariant.id,
        size: selectedVariant.size,
        sku: selectedVariant.sku,
        total_stock: selectedVariant.stock, 
      },
      1
    )

    toast.success(
      `${product.name} - Talle ${selectedVariant.size} agregado al carrito`,
      {
        position: "bottom-right",
        autoClose: 3000,
      }
    )

    if (onAddToCart) onAddToCart()
  }

  // Determinar si está deshabilitado
  const isDisabled = hasVariants 
    ? !selectedVariant // Con variantes: requiere talle seleccionado
    : product.stock === 0 // Sin variantes: requiere stock

  // Texto del botón
  const getButtonText = () => {
    if (!hasVariants && product.stock === 0) return "SIN STOCK"
    if (hasVariants && !selectedVariant) return "SELECCIONÁ UN TALLE"
    return "AGREGAR AL CARRITO"
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={`
        flex-1 px-6 py-3 font-bold transition-all
        ${!isDisabled
          ? "bg-highlight text-white hover:bg-[#bc9740] cursor-pointer"
          : "bg-gray-700 text-gray-400 cursor-not-allowed"
        }
      `}
    >
      {getButtonText()}
    </button>
  )
}