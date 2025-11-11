"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/cart-store";

export default function AddToCartButton({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state: any) => state.addItem);

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: parseFloat(product.price),
        image_url: product.image_url || undefined,
        brand: product.brand || 'Golem',
        seller_mp_id: product.seller_mp_id || null,
        commission_rate: parseFloat(product.commission_rate) || 0,
      },
      quantity
    );
    
    alert(`${quantity} x ${product.name} agregado al carrito!`);
  };

  return (
    <div>
      <button onClick={handleAddToCart} className="flex-1 px-6 py-3 bg-black border-2 border-highlight text-highlight font-bold hover:bg-highlight hover:text-black transition-colors" >Agregar al carrito</button>
      <label htmlFor="quantity" className="ml-8">Cantidad:</label>
      <input
        type="number"
        id="quantity"
        min="1"
        max={product.stock}
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
        style={{ marginLeft: "8px", marginRight: "8px", width: "60px" }}
      />
    </div>
  );
}