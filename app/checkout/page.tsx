"use client";

import { useCartStore } from "@/lib/store/cart-store";
import { useShippingStore } from "@/lib/store/shipping-store";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const items = useCartStore((state: any) => state.items);
  const getTotal = useCartStore((state: any) => state.getTotal);
  const router = useRouter();

  // OBTENER DATOS DE ENVÍO (por separado para evitar re-renders)
  const shippingAddress = useShippingStore((state) => state.address);
  const shippingCostData = useShippingStore((state) => state.cost);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dni: "",
  });

  const [loading, setLoading] = useState(false);

  // VALIDAR QUE HAYA DATOS DE ENVÍO
  if (!shippingAddress || !shippingCostData) {
    return (
      <div className="min-h-screen bg-black p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Datos de envío incompletos
          </h1>
          <p className="text-gray-400 mb-6">
            Por favor, completá los datos de envío en el carrito.
          </p>
          <button
            onClick={() => router.push("/cart")}
            className="px-6 py-3 bg-[#d3b05c] text-black font-semibold rounded hover:bg-[#c9a04a] transition"
          >
            Volver al carrito
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Carrito vacío</h1>
          <p className="text-gray-400 mb-6">No tenés productos para comprar.</p>
          <button
            onClick={() => router.push("/products")}
            className="px-6 py-3 bg-[#d3b05c] text-black font-semibold rounded hover:bg-[#c9a04a] transition"
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  const subtotal = getTotal();
  const shippingCost = shippingCostData.costo || 0;
  const total = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyer: formData,
          items: items,
          subtotal: subtotal,
          shippingCost: shippingCost,
          shippingAddress: shippingAddress,
          total: total,
        }),
      });

      const data = await response.json();

      if (data.success && data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert("Error al crear la preferencia de pago");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error en checkout:", error);
      alert("Error al procesar el pago");
      setLoading(false);
    }
  };

  const mercadoPago = '../mercadopago.png';

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 md:py-12">
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">CHECKOUT</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-3 text-white">Nombre y Apellido</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-stone-950 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d3b05c] transition"
                  placeholder="Ingresa tu nombre completo"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3 text-white">Correo electrónico</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-stone-950 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d3b05c] transition"
                  placeholder="Ingresa tu correo electronico"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3 text-white">Teléfono</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-stone-950 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d3b05c] transition"
                  placeholder="3415551234"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3 text-white">DNI</label>
                <input
                  type="text"
                  required
                  value={formData.dni}
                  onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                  className="w-full bg-stone-950 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d3b05c] transition"
                  placeholder="12345678"
                />
              </div>

              <div className="pt-8">
                <h3 className="text-lg font-semibold mb-6">Pagar con Mercado Pago</h3>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-sky-300 cursor-pointer text-black font-bold rounded-lg hover:shadow-lg hover:bg-sky-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? "Procesando..." : <img src={mercadoPago} className="h-15 w-auto object-contain" alt="Golem" />}
                </button>
              </div>
            </form>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-stone-950 rounded-lg p-6 border border-gray-700">
              <h3 className="text-2xl font-bold mb-6">Resumen de orden</h3>

              <div className="mb-6">
                <div className="space-y-3">
                  {items.map((item: any) => (
                       <div key={`${item.id}-${item.variant_id || 'no-variant'}`} className="flex justify-between items-start text-sm">
        <div className="flex-1">
          <span className="text-gray-300 block">{item.name}</span>
          {item.size && (
            <span className="text-xs text-gray-500">Talle: {item.size}</span>
          )}
        </div>
                      <span className="text-gray-400 w-16 text-center">x{item.quantity}</span>
                      <span className="text-white font-semibold w-20 text-right">
                        ${(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* DATOS DE ENVÍO */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h4 className="text-sm font-semibold text-white mb-3">Envío</h4>
                
                {shippingAddress.tipoEntrega === "retiro" ? (
                  <div className="text-sm space-y-1">
                    <p className="text-[#d3b05c] font-semibold">Retiro en punto</p>
                    <p className="text-gray-400">Bv. Oroño 3614</p>
                    <p className="text-gray-400">Rosario, Santa Fe</p>
                  </div>
                ) : (
                  <div className="text-sm space-y-1">
                    <p className="text-white">
                      {shippingAddress.domicilio}
                      {shippingAddress.pisoDepto && `, ${shippingAddress.pisoDepto}`}
                    </p>
                    <p className="text-gray-400">
                      {shippingAddress.ciudadNombre}, {shippingAddress.provinciaNombre}
                    </p>
                    <p className="text-gray-400">CP: {shippingAddress.codigoPostal}</p>
                  </div>
                )}

                <div className="mt-3 flex justify-between items-center text-sm">
                  <span className="text-gray-400">Costo de envío:</span>
                  <span className="font-semibold">
                    {shippingCostData.esGratis ? (
                      <span className="text-[#d3b05c]">GRATIS</span>
                    ) : (
                      <span className="text-white">${shippingCost}</span>
                    )}
                  </span>
                </div>
              </div>

              {/* TOTALES */}
              <div className="mt-6 pt-6 border-t border-gray-700 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal:</span>
                  <span className="text-white">${subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Envío:</span>
                  <span className={shippingCostData.esGratis ? "text-[#d3b05c]" : "text-white"}>
                    {shippingCostData.esGratis ? "GRATIS" : `$${shippingCost}`}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">TOTAL:</span>
                  <span className="text-2xl font-bold text-[#d3b05c]">
                    ${total}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}