import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import sql from "@/lib/db"
import { Package, ShoppingCart, TrendingUp, Clock } from "lucide-react"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  // Obtener estadísticas
  const [ordersCount] = await sql`SELECT COUNT(*) as total FROM orders`
  const [productsCount] = await sql`SELECT COUNT(*) as total FROM products`
  const [totalRevenue] = await sql`
    SELECT COALESCE(SUM(total), 0) as revenue 
    FROM orders 
    WHERE status = 'approved'
  `
  const [pendingOrders] = await sql`
    SELECT COUNT(*) as total 
    FROM orders 
    WHERE status = 'pending'
  `

  const stats = [
    {
      icon: ShoppingCart,
      label: "Órdenes Totales",
      value: ordersCount.total,
      color: "text-blue-500",
    },
    {
      icon: Package,
      label: "Productos",
      value: productsCount.total,
      color: "text-green-500",
    },
    {
      icon: TrendingUp,
      label: "Ingresos",
      value: `$${parseFloat(totalRevenue.revenue).toLocaleString('es-AR')}`,
      color: "text-[#d3b05c]",
    },
    {
      icon: Clock,
      label: "Órdenes Pendientes",
      value: pendingOrders.total,
      color: "text-yellow-500",
    },
  ]

  // Últimas órdenes
  const recentOrders = await sql`
    SELECT id, buyer_name, total, status, created_at
    FROM orders
    ORDER BY created_at DESC
    LIMIT 5
  `

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">Bienvenido, {session.user?.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm font-medium">{stat.label}</h3>
                <Icon className={stat.color} size={24} />
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-6">Órdenes Recientes</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-800">
                <th className="pb-3 text-sm font-semibold text-gray-400">ID</th>
                <th className="pb-3 text-sm font-semibold text-gray-400">Cliente</th>
                <th className="pb-3 text-sm font-semibold text-gray-400">Total</th>
                <th className="pb-3 text-sm font-semibold text-gray-400">Estado</th>
                <th className="pb-3 text-sm font-semibold text-gray-400">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order: any) => (
                <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-4 text-sm">#{order.id}</td>
                  <td className="py-4 text-sm">{order.buyer_name}</td>
                  <td className="py-4 text-sm">${parseFloat(order.total).toLocaleString('es-AR')}</td>
                  <td className="py-4">
                    <span className={`
                      px-2 py-1 rounded text-xs font-semibold
                      ${order.status === 'approved' ? 'bg-green-500/10 text-green-500' : ''}
                      ${order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                      ${order.status === 'rejected' ? 'bg-red-500/10 text-red-500' : ''}
                    `}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-gray-400">
                    {new Date(order.created_at).toLocaleDateString('es-AR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}