"use client";

import { useCartStore } from "@/lib/store/cart-store";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CartPage() {

    const [mounted, setMounted] = useState(false)

  const items = useCartStore((state: any) => state.items);
  const removeItem = useCartStore((state: any) => state.removeItem);
  const updateQuantity = useCartStore((state: any) => state.updateQuantity);
  const getTotal = useCartStore((state: any) => state.getTotal);
  const clearCart = useCartStore((state: any) => state.clearCart);

      useEffect(() => {
    setMounted(true);
  }, []);

  // Mientras carga, mostrar skeleton
  if (!mounted) {
    return (
      <div>
        <h1>Cargando carrito...</h1>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div>
        <h1>Carrito vacío</h1>
        <p>No hay productos en tu carrito.</p>
        <Link href="/products">Ver productos</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Mi Carrito</h1>

      <div>
        {items.map((item: any) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              padding: "16px",
              marginBottom: "16px",
            }}
          >
            <h3>{item.name}</h3>
            <p>Precio unitario: ${item.price}</p>
            
            <div style={{ marginTop: "8px" }}>
              <label>Cantidad: </label>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                style={{ width: "60px", marginLeft: "8px" }}
              />
            </div>

            <p>
              <strong>Subtotal: ${item.price * item.quantity}</strong>
            </p>

            <button onClick={() => removeItem(item.id)}>Eliminar</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "24px", padding: "16px", border: "2px solid #333" }}>
        <h2>Total: ${getTotal()}</h2>
        <Link 
          href="/checkout"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mr-2"
        >
          Ir a pagar
        </Link>
        <button onClick={clearCart}>Vaciar carrito</button>
      </div>

      <div style={{ marginTop: "16px" }}>
        <Link href="/products">← Seguir comprando</Link>
      </div>
    </div>
  );
}