"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, ShoppingCart } from "lucide-react"

interface CartNotificationProps {
  show: boolean
  productName: string
  productImage?: string
  productPrice: number
  size?: string | null
  onClose: () => void
}

export default function CartNotification({
  show,
  productName,
  productImage,
  productPrice,
  size,
  onClose,
}: CartNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      // Auto-cerrar después de 5 segundos
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Esperar animación
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show && !isVisible) return null

  return (
    <>
      {/* Overlay solo en mobile */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => {
          setIsVisible(false)
          setTimeout(onClose, 300)
        }}
      />

      {/* Notificación - Drawer en mobile, Toast en desktop */}
      <div
        className={`
          fixed z-50 
          
          /* Mobile: Bottom drawer - ANCHO COMPLETO */
          bottom-0 left-0 right-0
          lg:bottom-4 lg:right-4 lg:left-auto lg:max-w-md
          
          bg-black border-t-4 lg:border-t-0 lg:border-2 border-highlight
          shadow-2xl
          
          transition-transform duration-300 ease-out
          ${isVisible 
            ? "translate-y-0" 
            : "translate-y-full lg:translate-y-0 lg:translate-x-full"
          }
        `}
      >
        <div className="p-4 lg:p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-highlight/20 flex items-center justify-center">
                <ShoppingCart className="text-highlight" size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold">¡Agregado al carrito!</h3>
                <p className="text-gray-400 text-sm">Ya podés finalizar tu compra</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsVisible(false)
                setTimeout(onClose, 300)
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Product Info */}
          <div className="flex gap-4 mb-4">
            {productImage && (
              <div className="relative w-20 h-20 bg-gray-900 rounded flex-shrink-0 overflow-hidden">
                <Image
                  src={productImage}
                  alt={productName}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <p className="text-white font-semibold line-clamp-2">{productName}</p>
              {size && (
                <p className="text-gray-400 text-sm mt-1">Talle: {size}</p>
              )}
              <p className="text-highlight font-bold mt-1">
                ${productPrice}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
        <Link href={'/products'}>
            <button
              onClick={() => {
                  setIsVisible(false)
                  setTimeout(onClose, 300)
                }}
                className="flex-1 px-4 py-3 cursor-pointer border border-highlight/40 text-highlight font-semibold hover:bg-highlight/10 transition-colors"
                >
              Seguir comprando
            </button>
        </Link>
            <Link
              href="/cart"
              className="flex-1 px-4 py-3 bg-highlight text-white font-bold text-center hover:bg-[#bc9740] transition-colors"
            >
              VER CARRITO
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}