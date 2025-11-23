"use client";

import { useCartStore } from "@/lib/store/cart-store";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const items = useCartStore((state: any) => state.items);
  const getTotal = useCartStore((state: any) => state.getTotal);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dni: "",
  });

  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Carrito vacío</h1>
          <p className="text-gray-400 mb-6">No tenés productos para comprar.</p>
          <button
            onClick={() => router.push("/catalog")}
            className="px-6 py-3 bg-[#d3b05c] text-black font-semibold rounded hover:bg-[#c9a04a] transition"
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

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
          total: getTotal(),
        }),
      });

      const data = await response.json();

      if (data.success && data.init_point) {
        // Redirigir a Mercado Pago
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

  const mercadoPago = '../mercadopago.png'

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">CHECKOUT</h1>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Last Name */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-white">Nombre y Apellido</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d3b05c] transition"
                  placeholder="Roger Federer"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-white">Correo electrónico</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d3b05c] transition"
                  placeholder="roger@federer.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-white">Teléfono</label>
                <input
                  type="dni"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d3b05c] transition"
                  placeholder="45265573"
                />
              </div>

                {/* dni */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-white">DNI</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d3b05c] transition"
                  placeholder="1123456789"
                />
              </div>

              {/* Payment Method Section */}
              <div className="pt-8">
                <h3 className="text-lg font-semibold mb-6"> Pagar con Mercado Pago</h3>
                
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

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h3 className="text-2xl font-bold mb-6">Resumen de orden</h3>

               <div className="mb-8">
                <div className="space-y-4">
                  {items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-start text-sm">
                      <span className="text-gray-300 flex-1">{item.name}</span>
                      <span className="text-gray-400 w-16 text-center">x{item.quantity}</span>
                      <span className="text-white font-semibold w-20 text-right">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Info */}
              <div className="mt-8 pt-8 border-t border-gray-700">
                <h4 className="text-sm font-semibold text-gray-400 mb-4">Envío</h4>
                <p className="text-sm text-gray-400">Dirección</p>
              </div>

              {/* Total */}
              <div className="pt-6 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">TOTAL:</span>
                  <span className="text-2xl font-bold text-[#d3b05c]">${getTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
