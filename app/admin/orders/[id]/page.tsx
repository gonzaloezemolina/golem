import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import sql from "@/lib/db"
import Link from "next/link"
import { ArrowLeft, Package, Truck, User, Mail, Phone, MapPin, CreditCard } from "lucide-react"
import OrderStatusUpdater from "@/components/admin/order-status-updater"

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/auth/login")
  }

  const { id } = await params

  const orders = await sql`
    SELECT * FROM orders WHERE id = ${id}
  `
  
  const order = orders[0]

  if (!order) {
    notFound()
  }

  const items = await sql`
    SELECT oi.*, p.name, p.image_url
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ${id}
  `

  const statusColors = {
    approved: "bg-green-500/10 text-green-500 border-green-500",
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500",
    rejected: "bg-red-500/10 text-red-500 border-red-500",
  }

  const statusLabels = {
    approved: "Aprobado",
    pending: "Pendiente",
    rejected: "Rechazado",
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Volver a órdenes
        </Link>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Orden #{order.id}</h1>
            <p className="text-gray-400">
              Creada el {new Date(order.created_at).toLocaleDateString('es-AR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          
          <div className={`
            px-4 py-2 rounded-lg font-semibold border
            ${statusColors[order.status as keyof typeof statusColors]}
          `}>
            {statusLabels[order.status as keyof typeof statusLabels]}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Package size={24} className="text-[#d3b05c]" />
              Productos
            </h2>
            
            <div className="space-y-4">
              {items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-4 border-b border-gray-800 last:border-0 last:pb-0"
                >
                  <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{item.name}</h3>
                    {item.variant_sku && (
                      <p className="text-sm text-gray-400">SKU: {item.variant_sku}</p>
                    )}
                    <p className="text-sm text-gray-400">
                      Cantidad: {item.quantity} × ${parseFloat(item.price).toLocaleString('es-AR')}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold">
                      ${(parseFloat(item.price) * item.quantity).toLocaleString('es-AR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800 space-y-2">
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

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Truck size={24} className="text-[#d3b05c]" />
              Información de Envío
            </h2>
            
            {order.shipping_type === 'retiro' ? (
              <div className="space-y-2">
                <p className="text-[#d3b05c] font-semibold text-lg">Retiro en punto</p>
                <div className="flex items-start gap-2 text-gray-300">
                  <MapPin size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p>Bv. Oroño 3614</p>
                    <p>Rosario, Santa Fe</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-semibold text-lg">Envío a domicilio</p>
                <div className="flex items-start gap-2 text-gray-300">
                  <MapPin size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p>{order.shipping_address}</p>
                    <p>{order.shipping_city}, {order.shipping_province}</p>
                    <p>CP: {order.shipping_zip}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-4">
                  Costo: {parseFloat(order.shipping_cost) === 0 
                    ? <span className="text-[#d3b05c] font-semibold">GRATIS</span>
                    : `$${parseFloat(order.shipping_cost).toLocaleString('es-AR')}`
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <User size={24} className="text-[#d3b05c]" />
              Cliente
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Nombre</p>
                <p className="font-semibold">{order.buyer_name}</p>
              </div>
              
          <div>
  <p className="text-sm text-gray-400 mb-1 flex items-center gap-2">
    <Mail size={16} />
    Email
  </p>
  <a 
    href={`mailto:${order.buyer_email}`}
    className="text-[#d3b05c] hover:underline break-all"
  >
    {order.buyer_email}
  </a>
</div>

{order.buyer_phone && (
  <div>
    <p className="text-sm text-gray-400 mb-1 flex items-center gap-2">
      <Phone size={16} />
      Teléfono
    </p>
    <a 
      href={`tel:${order.buyer_phone}`}
      className="text-[#d3b05c] hover:underline"
    >
      {order.buyer_phone}
    </a>
  </div>
)}
              
              {order.buyer_dni && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">DNI</p>
                  <p className="font-mono">{order.buyer_dni}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CreditCard size={24} className="text-[#d3b05c]" />
              Pago
            </h2>
            
            <div className="space-y-3">
              {order.payment_id && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">ID de Pago</p>
                  <p className="font-mono text-sm break-all">{order.payment_id}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-gray-400 mb-1">Método</p>
                <p>MercadoPago</p>
              </div>
            </div>
          </div>

          <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
        </div>
      </div>
    </div>
  )
}