"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search, Filter, Eye, Download } from "lucide-react"

interface Order {
  id: number
  buyer_name: string
  buyer_email: string
  total: string
  status: string
  created_at: Date
  shipping_type: string
}

interface OrdersTableProps {
  orders: Order[]
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (statusFilter !== "all") params.set("status", statusFilter)
    router.push(`/admin/orders?${params.toString()}`)
  }

  const handleStatusChange = (status: string) => {
    setStatusFilter(status)
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (status !== "all") params.set("status", status)
    router.push(`/admin/orders?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearch("")
    setStatusFilter("all")
    router.push("/admin/orders")
  }

  const statusColors = {
    approved: "bg-green-500/10 text-green-500 border-green-500/20",
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    rejected: "bg-red-500/10 text-red-500 border-red-500/20",
  }

  const statusLabels = {
    approved: "Aprobado",
    pending: "Pendiente",
    rejected: "Rechazado",
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg">
      {/* Filters */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por cliente o email..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#d3b05c]"
              />
            </div>
          </form>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#d3b05c]"
            >
              <option value="all">Todos los estados</option>
              <option value="approved">Aprobados</option>
              <option value="pending">Pendientes</option>
              <option value="rejected">Rechazados</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(search || statusFilter !== "all") && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-4 mt-4 text-sm">
          <span className="text-gray-400">
            Total: <strong className="text-white">{orders.length}</strong> órdenes
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-400">
            Aprobadas: <strong className="text-green-500">
              {orders.filter(o => o.status === 'approved').length}
            </strong>
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-400">
            Pendientes: <strong className="text-yellow-500">
              {orders.filter(o => o.status === 'pending').length}
            </strong>
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-800">
              <th className="px-6 py-4 text-sm font-semibold text-gray-400">ID</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-400">Cliente</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-400">Email</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-400">Total</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-400">Envío</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-400">Estado</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-400">Fecha</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                  No se encontraron órdenes
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-[#d3b05c]">#{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium">{order.buyer_name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {order.buyer_email}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold">
                      ${parseFloat(order.total).toLocaleString('es-AR')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`
                      px-2 py-1 rounded text-xs font-semibold
                      ${order.shipping_type === 'retiro' 
                        ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' 
                        : 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                      }
                    `}>
                      {order.shipping_type === 'retiro' ? 'Retiro' : 'Envío'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-semibold border
                      ${statusColors[order.status as keyof typeof statusColors]}
                    `}>
                      {statusLabels[order.status as keyof typeof statusLabels]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(order.created_at).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                    <br />
                    <span className="text-xs">
                      {new Date(order.created_at).toLocaleTimeString('es-AR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="p-2 bg-[#d3b05c]/10 text-[#d3b05c] rounded hover:bg-[#d3b05c]/20 transition-colors"
                        title="Ver detalle"
                      >
                        <Eye size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination placeholder */}
      {orders.length > 0 && (
        <div className="p-4 border-t border-gray-800 flex items-center justify-between text-sm text-gray-400">
          <span>Mostrando {orders.length} órdenes</span>
          <span>Paginación próximamente</span>
        </div>
      )}
    </div>
  )
}