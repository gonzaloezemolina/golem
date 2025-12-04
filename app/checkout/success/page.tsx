"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Package, Truck, Mail, Home } from "lucide-react"
import { useCartStore } from "@/lib/store/cart-store"
import { useShippingStore } from "@/lib/store/shipping-store"

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const clearCart = useCartStore((state: any) => state.clearCart)
  const clearShipping = useShippingStore((state) => state.clearShipping)
  
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const orderId = searchParams.get("order_id")

  useEffect(() => {
    if (!orderId) {
      router.push("/products")
      return
    }

    // Obtener datos de la orden
    fetch(`/api/orders/${orderId}`)
      .then(res => res.json())
      .then(data => {
        setOrder(data)
        setLoading(false)
        
        // Vaciar carrito y datos de envío
        clearCart()
        clearShipping()
      })
      .catch(err => {
        console.error("Error al cargar orden:", err)
        setLoading(false)
      })
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#d3b05c] mx-auto mb-4"></div>
          <p className="text-white">Cargando orden...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Orden no encontrada</h1>
          <Link href="/products" className="text-[#d3b05c] hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header de éxito */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full mb-6">
            <CheckCircle size={48} className="text-green-500" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ¡Compra exitosa!
          </h1>
          
          <p className="text-xl text-gray-400 mb-2">
            Tu pedido ha sido confirmado
          </p>
          
          <div className="inline-block bg-[#d3b05c]/10 border border-[#d3b05c] rounded-lg px-6 py-3 mt-4">
            <p className="text-sm text-gray-400">Número de orden</p>
            <p className="text-2xl font-bold text-[#d3b05c]">#{order.id}</p>
          </div>
        </div>

        {/* Información de la orden */}
        <div className="bg-gray-900 rounded-lg p-6 md:p-8 mb-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Package size={24} className="text-[#d3b05c]" />
            Detalles de tu pedido
          </h2>
          
          <div className="space-y-4 mb-6">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center pb-4 border-b border-gray-800 last:border-0">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-400">Cantidad: {item.quantity}</p>
                </div>
                <p className="font-bold">${(item.price * item.quantity).toLocaleString('es-AR')}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-800 space-y-2">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal:</span>
              <span>${(parseFloat(order.total) - parseFloat(order.shipping_cost || 0)).toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Envío:</span>
              <span className={parseFloat(order.shipping_cost) === 0 ? 'text-[#d3b05c] font-semibold' : ''}>
                {parseFloat(order.shipping_cost) === 0 ? 'GRATIS' : `$${parseFloat(order.shipping_cost).toLocaleString('es-AR')}`}
              </span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray-700">
              <span>Total:</span>
              <span className="text-[#d3b05c]">${parseFloat(order.total).toLocaleString('es-AR')}</span>
            </div>
          </div>
        </div>

        {/* Información de envío */}
        <div className="bg-gray-900 rounded-lg p-6 md:p-8 mb-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Truck size={24} className="text-[#d3b05c]" />
            Información de envío
          </h2>
          
          {order.shipping_type === 'retiro' ? (
            <div>
              <p className="text-[#d3b05c] font-semibold mb-2">Retiro en punto</p>
              <p className="text-gray-400">📍 Bv. Oroño 3614, Rosario, Santa Fe</p>
              <p className="text-sm text-gray-500 mt-4">
                Te avisaremos por email cuando tu pedido esté listo para retirar.
              </p>
            </div>
          ) : (
            <div>
              <p className="font-semibold mb-2">Envío a domicilio</p>
              <p className="text-gray-400">📍 {order.shipping_address}</p>
              <p className="text-gray-400">{order.shipping_city}, {order.shipping_province}</p>
              <p className="text-gray-400">CP: {order.shipping_zip}</p>
              <p className="text-sm text-gray-500 mt-4">
                Recibirás un email cuando tu pedido sea despachado.
              </p>
            </div>
          )}
        </div>

        {/* Próximos pasos */}
        <div className="bg-[#d3b05c]/10 border border-[#d3b05c] rounded-lg p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Mail size={24} className="text-[#d3b05c]" />
            ¿Qué sigue?
          </h2>
          
          <div className="space-y-3 text-gray-300">
            <p className="flex items-start gap-2">
              <span className="text-[#d3b05c] font-bold">1.</span>
              <span>Te enviamos un email de confirmación a <strong className="text-white">{order.buyer_email}</strong></span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#d3b05c] font-bold">2.</span>
              <span>Preparamos tu pedido (1-2 días hábiles)</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#d3b05c] font-bold">3.</span>
              <span>
                {order.shipping_type === 'retiro' 
                  ? 'Te notificamos cuando esté listo para retirar'
                  : 'Despachamos tu pedido y te enviamos el código de seguimiento'}
              </span>
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/products"
            className="flex-1 bg-[#d3b05c] text-black text-center font-bold py-4 px-6 rounded-lg hover:bg-[#e6c570] transition-colors flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Seguir comprando
          </Link>
          
          <Link 
            href="/contact"
            className="flex-1 bg-gray-800 text-white text-center font-semibold py-4 px-6 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
          >
            Contactar soporte
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>¿Tenés alguna duda? Escribinos a <a href="mailto:soporte@golem.com" className="text-[#d3b05c] hover:underline">soporte@golem.com</a></p>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}