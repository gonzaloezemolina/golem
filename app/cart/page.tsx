"use client";

import { useCartStore } from "@/lib/store/cart-store";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Trash2, Plus, Minus, Truck, Shield } from 'lucide-react';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("standard");

  const items = useCartStore((state: any) => state.items);
  const removeItem = useCartStore((state: any) => state.removeItem);
  const updateQuantity = useCartStore((state: any) => state.updateQuantity);
  const getTotal = useCartStore((state: any) => state.getTotal);
  const clearCart = useCartStore((state: any) => state.clearCart);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <h1 className="text-2xl font-bold text-white mb-2">Cargando carrito...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black px-4 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Carrito</h1>
          <p className="text-gray-400 mb-8">No hay productos seleccionados.</p>
          <Link 
            href="/products" 
            className="inline-block bg-[#d3b05c] text-black px-8 py-3 rounded-full font-semibold hover:bg-[#e6c570] transition-colors"
          >
            Continuar comprando
          </Link>
        </div>
      </div>
    );
  }

  const shippingCost = shippingMethod === "express" ? 12.00 : 0;
  const subtotal = getTotal();
  const vat = subtotal * 0.20;
  const total = subtotal + shippingCost + vat;

  return (
    <div className="min-h-screen bg-black px-4 py-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-8">MIS PRODUCTOS</h1>
          {/* <div className="flex items-center justify-between max-w-2xl">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#d3b05c] text-black flex items-center justify-center font-bold text-sm">✓</div>
              <p className="text-xs text-white mt-2">Carrito</p>
            </div>
            <div className="flex-1 h-0.5 bg-[#333] mx-4"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#333] text-white flex items-center justify-center font-bold text-sm">2</div>
              <p className="text-xs text-gray-400 mt-2">Envío</p>
            </div>
            <div className="flex-1 h-0.5 bg-[#333] mx-4"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#333] text-white flex items-center justify-center font-bold text-sm">3</div>
              <p className="text-xs text-gray-400 mt-2">Pago</p>
            </div>
          </div> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left section: Cart items */}
          <div className="lg:col-span-2">
            
            <div className="bg-[#1a1a1a] rounded-lg p-6 mb-6 border border-[#333]">
              <h2 className="text-xl font-bold text-white mb-6">Selección de productos</h2>
              <div className="space-y-4">
                {items.map((item: any) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-[#333] last:border-0">
                    
                    <div className="relative w-20 h-20 bg-[#2a2a2a] rounded-lg flex-shrink-0 border border-[#444] flex items-center justify-center">
                      <Image className="text-xs object-cover text-gray-500" fill src={item.image_url} alt={item.name} />
                    </div>

                    {/* Product info */}
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-400 mb-3">${item.price.toFixed(2)}</p>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 hover:bg-[#333] rounded transition-colors"
                        >
                          <Minus size={16} className="text-gray-400" />
                        </button>
                        {/* <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-12 bg-[#2a2a2a] text-white text-center py-1 rounded border border-[#444] text-sm"
                        /> */}
                        <p>{item.quantity}</p>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-[#333] rounded transition-colors"
                        >
                          <Plus size={16} className="text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Price and remove */}
                    <div className="flex flex-col items-end justify-between">
                      <p className="text-white font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#333]">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Truck size={20} />
                Método de Envío
              </h3>
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-[#d3b05c] rounded-lg cursor-pointer hover:bg-[#2a2a2a] transition-colors">
                  <input
                    type="radio"
                    name="shipping"
                    value="standard"
                    checked={shippingMethod === "standard"}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="w-4 h-4 accent-[#d3b05c]"
                  />
                  <div className="ml-4 flex-1">
                    <p className="text-white font-semibold">Envío Estándar</p>
                    <p className="text-sm text-gray-400">3-5 días laborales</p>
                  </div>
                </label>
                
                <label className="flex items-center p-4 border border-[#444] rounded-lg cursor-pointer hover:bg-[#2a2a2a] transition-colors">
                  <input
                    type="radio"
                    name="shipping"
                    value="express"
                    checked={shippingMethod === "express"}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="w-4 h-4 accent-[#d3b05c]"
                  />
                  <div className="ml-4 flex-1">
                    <p className="text-white font-semibold">Envío Expreso</p>
                    <p className="text-sm text-gray-400">1-2 días laborales</p>
                  </div>
                  <p className="text-white font-bold">$12.00</p>
                </label>
              </div>
            </div>
          </div>

          {/* Right section: Order summary and checkout */}
          <div>
            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#333] sticky top-8">
              <h2 className="text-xl font-bold text-white mb-6">Detalles de Pago</h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-[#333]">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Envío</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>IVA (20%)</span>
                  <span>${vat.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-[#d3b05c] font-bold">${total.toFixed(2)}</span>
                </div>
              </div>

              <Link 
                href="/checkout"
                className="w-full block text-center bg-[#d3b05c] text-black font-bold py-3 rounded-lg hover:bg-[#e6c570] transition-colors mb-4"
              >
                Proceder al Pago
              </Link>

              <Link 
                href="/products"
                className="w-full block text-center border border-[#d3b05c] text-[#d3b05c] font-semibold py-2 rounded-lg hover:bg-[#d3b05c]/10 transition-colors mb-4"
              >
                Continuar Comprando
              </Link>

              <button
                onClick={clearCart}
                className="w-full text-gray-400 text-sm hover:text-red-500 transition-colors py-2"
              >
                Vaciar Carrito
              </button>

              <div className="mt-6 pt-6 border-t border-[#333] flex items-center justify-center gap-2 text-xs text-gray-500">
                <Shield size={16} />
                <span>Pago 100% Seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
