"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Clock, Mail, AlertCircle, Home } from "lucide-react"

function PendingContent() {
  const searchParams = useSearchParams()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const orderId = searchParams.get("order_id")

  useEffect(() => {
    if (!orderId) return

    fetch(`/api/orders/${orderId}`)
      .then(res => res.json())
      .then(data => {
        setOrder(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error:", err)
        setLoading(false)
      })
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500/10 rounded-full mb-6">
            <Clock size={48} className="text-yellow-500" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Pago en proceso
          </h1>
          
          <p className="text-xl text-gray-400">
            Tu pago está siendo validado
          </p>
          
          {order && (
            <div className="inline-block bg-yellow-500/10 border border-yellow-500 rounded-lg px-6 py-3 mt-6">
              <p className="text-sm text-gray-400">Número de orden</p>
              <p className="text-2xl font-bold text-yellow-500">#{order.id}</p>
            </div>
          )}
        </div>

        {/* Información */}
        <div className="bg-gray-900 rounded-lg p-6 md:p-8 mb-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle size={24} className="text-yellow-500" />
            ¿Qué significa esto?
          </h2>
          
          <div className="space-y-4 text-gray-300">
            <p>
              Tu pago está siendo procesado por el banco. Esto puede suceder cuando:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Pagaste con tarjeta de débito</li>
              <li>Pagaste en efectivo (Rapipago, Pago Fácil)</li>
              <li>El banco necesita validación adicional</li>
            </ul>
            <p className="pt-4">
              <strong className="text-white">Tiempo estimado:</strong> Entre 15 minutos y 48 horas hábiles
            </p>
          </div>
        </div>

        {/* Email de confirmación */}
        <div className="bg-[#d3b05c]/10 border border-[#d3b05c] rounded-lg p-6 md:p-8 mb-8">
          <div className="flex items-start gap-4">
            <Mail size={24} className="text-[#d3b05c] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold mb-2">Te mantendremos informado</h3>
              <p className="text-gray-300">
                Te enviaremos un email a <strong className="text-white">{order?.buyer_email}</strong> cuando se confirme el pago.
              </p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="space-y-4">
          <Link 
            href="/products"
            className="w-full bg-[#d3b05c] text-black text-center font-bold py-4 px-6 rounded-lg hover:bg-[#e6c570] transition-colors flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Volver al inicio
          </Link>
          
          <Link 
            href="/contact"
            className="w-full bg-gray-800 text-white text-center font-semibold py-4 px-6 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700 block"
          >
            ¿Necesitás ayuda? Contactanos
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Guardá el número de orden <strong className="text-white">#{order?.id}</strong> para consultas</p>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPending() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    }>
      <PendingContent />
    </Suspense>
  )
}