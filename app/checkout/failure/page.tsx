"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { XCircle, RefreshCw, Mail, AlertTriangle } from "lucide-react"

function FailureContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [order, setOrder] = useState<any>(null)
  
  const orderId = searchParams.get("order_id")

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then(res => res.json())
        .then(data => setOrder(data))
        .catch(err => console.error("Error:", err))
    }
  }, [orderId])

  const handleRetry = () => {
    router.push("/checkout")
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/10 rounded-full mb-6">
            <XCircle size={48} className="text-red-500" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Pago rechazado
          </h1>
          
          <p className="text-xl text-gray-400">
            No pudimos procesar tu pago
          </p>

          {/* Número de orden si existe */}
          {order && (
            <div className="inline-block bg-red-500/10 border border-red-500 rounded-lg px-6 py-3 mt-6">
              <p className="text-sm text-gray-400">Número de orden</p>
              <p className="text-2xl font-bold text-red-500">#{order.id}</p>
            </div>
          )}
        </div>

        {/* Razones posibles */}
        <div className="bg-gray-900 rounded-lg p-6 md:p-8 mb-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle size={24} className="text-yellow-500" />
            Posibles razones
          </h2>
          
          <div className="space-y-3 text-gray-300">
            <p className="flex items-start gap-2">
              <span className="text-red-500">•</span>
              <span>Fondos insuficientes en la tarjeta</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-red-500">•</span>
              <span>Datos de la tarjeta incorrectos</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-red-500">•</span>
              <span>Límite de compra excedido</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-red-500">•</span>
              <span>Tarjeta vencida o bloqueada</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-red-500">•</span>
              <span>Rechazo del banco emisor</span>
            </p>
          </div>
        </div>

        {/* Qué hacer */}
        <div className="bg-[#d3b05c]/10 border border-[#d3b05c] rounded-lg p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold mb-4">¿Qué puedo hacer?</h2>
          
          <div className="space-y-3 text-gray-300">
            <p className="flex items-start gap-2">
              <span className="text-[#d3b05c] font-bold">1.</span>
              <span>Verificá que los datos de tu tarjeta sean correctos</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#d3b05c] font-bold">2.</span>
              <span>Asegurate de tener fondos suficientes</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#d3b05c] font-bold">3.</span>
              <span>Intentá con otra tarjeta o medio de pago</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#d3b05c] font-bold">4.</span>
              <span>Contactá a tu banco si el problema persiste</span>
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="space-y-4">
          <button 
            onClick={handleRetry}
            className="w-full bg-[#d3b05c] text-black text-center font-bold py-4 px-6 rounded-lg hover:bg-[#e6c570] transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={20} />
            Reintentar pago
          </button>
          
          <Link 
            href="/cart"
            className="w-full bg-gray-800 text-white text-center font-semibold py-4 px-6 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700 block"
          >
            Volver al carrito
          </Link>
          
          <Link 
            href="/contact"
            className="w-full bg-transparent text-[#d3b05c] text-center font-semibold py-4 px-6 rounded-lg hover:bg-[#d3b05c]/10 transition-colors border border-[#d3b05c] flex items-center justify-center gap-2"
          >
            <Mail size={20} />
            Contactar soporte
          </Link>
        </div>

        {/* Mensaje de tranquilidad */}
        <div className="text-center mt-12 p-6 bg-gray-900/50 rounded-lg border border-gray-800">
          <p className="text-gray-400">
            <strong className="text-white">Tranquilo:</strong> Tu carrito está guardado y no perdiste nada. Podés intentar nuevamente cuando quieras.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutFailure() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    }>
      <FailureContent />
    </Suspense>
  )
}