"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface OrderStatusUpdaterProps {
  orderId: number
  currentStatus: string
}

export default function OrderStatusUpdater({ orderId, currentStatus }: OrderStatusUpdaterProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setStatus(newStatus)
        router.refresh()
      } else {
        alert("Error al actualizar el estado")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al actualizar el estado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h3 className="font-bold mb-4">Cambiar Estado</h3>
      
      <div className="space-y-2">
        <button
          onClick={() => handleStatusChange("pending")}
          disabled={loading || status === "pending"}
          className={`
            w-full px-4 py-2 rounded-lg text-left transition-colors flex items-center justify-between
            ${status === "pending"
              ? "bg-yellow-500/20 border-2 border-yellow-500 text-yellow-500"
              : "bg-gray-800 border border-gray-700 hover:bg-gray-700"
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <span>Pendiente</span>
          {loading && status !== "pending" && <Loader2 size={16} className="animate-spin" />}
        </button>

        <button
          onClick={() => handleStatusChange("approved")}
          disabled={loading || status === "approved"}
          className={`
            w-full px-4 py-2 rounded-lg text-left transition-colors flex items-center justify-between
            ${status === "approved"
              ? "bg-green-500/20 border-2 border-green-500 text-green-500"
              : "bg-gray-800 border border-gray-700 hover:bg-gray-700"
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <span>Aprobado</span>
          {loading && status !== "approved" && <Loader2 size={16} className="animate-spin" />}
        </button>

        <button
          onClick={() => handleStatusChange("rejected")}
          disabled={loading || status === "rejected"}
          className={`
            w-full px-4 py-2 rounded-lg text-left transition-colors flex items-center justify-between
            ${status === "rejected"
              ? "bg-red-500/20 border-2 border-red-500 text-red-500"
              : "bg-gray-800 border border-gray-700 hover:bg-gray-700"
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <span>Rechazado</span>
          {loading && status !== "rejected" && <Loader2 size={16} className="animate-spin" />}
        </button>
      </div>
    </div>
  )
}