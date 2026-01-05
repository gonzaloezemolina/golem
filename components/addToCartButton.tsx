"use client"

import { useState } from "react"
import { useCartStore } from "@/lib/store/cart-store"
import CartNotification from "./cart-notification"

interface ProductVariant {
  id: number
  size: string
  stock: number
  sku: string
}

interface AddToCartButtonProps {
  product: any
  selectedVariant: ProductVariant | null
  hasVariants: boolean
  onAddToCart?: () => void
}

export default function AddToCartButton({ 
  product, 
  selectedVariant,
  hasVariants,
  onAddToCart 
}: AddToCartButtonProps) {
  const addItem = useCartStore((state: any) => state.addItem)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationData, setNotificationData] = useState<any>(null)

  const handleAddToCart = () => {
    // CASO 1: Producto SIN variantes
    if (!hasVariants) {
      if (product.stock === 0) {
        alert('Producto sin stock')
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

      // Mostrar notificación custom
      setNotificationData({
        name: product.name,
        image: product.image_url,
        price: parseFloat(product.price),
        size: null,
      })
      setShowNotification(true)

      if (onAddToCart) onAddToCart()
      return
    }

    // CASO 2: Producto CON variantes
    if (!selectedVariant) {
      alert('Por favor, seleccioná un talle primero')
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

    // Mostrar notificación custom
    setNotificationData({
      name: product.name,
      image: product.image_url,
      price: parseFloat(product.price),
      size: selectedVariant.size,
    })
    setShowNotification(true)

    if (onAddToCart) onAddToCart()
  }

  const isDisabled = hasVariants 
    ? !selectedVariant
    : product.stock === 0

  const getButtonText = () => {
    if (!hasVariants && product.stock === 0) return "SIN STOCK"
    if (hasVariants && !selectedVariant) return "SELECCIONÁ UN TALLE"
    return "AGREGAR AL CARRITO"
  }

  return (
    <>
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

      {/* Notificación Custom */}
      {notificationData && (
        <CartNotification
          show={showNotification}
          productName={notificationData.name}
          productImage={notificationData.image}
          productPrice={notificationData.price}
          size={notificationData.size}
          onClose={() => {
            setShowNotification(false)
            setNotificationData(null)
          }}
        />
      )}
    </>
  )
}