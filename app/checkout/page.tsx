"use client";

import { useCartStore } from "@/lib/store/cart-store";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const items = useCartStore((state: any) => state.items);
  const getTotal = useCartStore((state: any) => state.getTotal);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Carrito vacío</h1>
        <p>No tenés productos para comprar.</p>
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

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Finalizar Compra</h1>

      {/* Resumen de productos */}
      <div className="mb-6 p-4 border border-gray-300 rounded">
        <h2 className="text-xl font-semibold mb-4">Resumen</h2>
        {items.map((item: any) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>${item.price * item.quantity}</span>
          </div>
        ))}
        <div className="border-t mt-4 pt-4 font-bold text-xl">
          Total: ${getTotal()}
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-semibold">Nombre completo</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-300 rounded px-4 py-2"
            placeholder="Juan Pérez"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border border-gray-300 rounded px-4 py-2"
            placeholder="juan@ejemplo.com"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Teléfono</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full border border-gray-300 rounded px-4 py-2"
            placeholder="1123456789"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Procesando..." : "Pagar con Mercado Pago"}
        </button>
      </form>
    </div>
  );
}