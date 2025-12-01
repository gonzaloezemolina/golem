import { create } from "zustand";
import Cookies from "js-cookie";

const CART_COOKIE_KEY = "golem-cart";

function loadCartFromCookie() {
  try {
    const cartCookie = Cookies.get(CART_COOKIE_KEY);
    return cartCookie ? JSON.parse(cartCookie) : [];
  } catch (error) {
    console.error("Error al cargar carrito:", error);
    return [];
  }
}

function saveCartToCookie(items: any[]) {
  Cookies.set(CART_COOKIE_KEY, JSON.stringify(items), { expires: 30 });
}

export const useCartStore = create((set, get: any) => ({
  items: loadCartFromCookie(),

  // MEJORADO: Agregar item con stock del producto
  addItem: (item: any, quantity: number) => {
    set((state: any) => {
      const existingItem = state.items.find((i: any) => i.id === item.id);

      let newItems;
      if (existingItem) {
        // Validar que no exceda el stock
        const newQuantity = Math.min(
          existingItem.quantity + quantity,
          item.total_stock || existingItem.total_stock || 999
        );
        
        newItems = state.items.map((i: any) =>
          i.id === item.id ? { ...i, quantity: newQuantity } : i
        );
      } else {
        // Agregar nuevo con stock guardado
        newItems = [...state.items, { 
          ...item, 
          quantity,
          total_stock: item.total_stock || 999 // Guardar stock para validar después
        }];
      }

      saveCartToCookie(newItems);
      return { items: newItems };
    });
  },

  removeItem: (id: number) => {
    set((state: any) => {
      const newItems = state.items.filter((i: any) => i.id !== id);
      saveCartToCookie(newItems);
      return { items: newItems };
    });
  },

  // MEJORADO: Validar stock al actualizar cantidad
  updateQuantity: (id: number, quantity: number) => {
    set((state: any) => {
      if (quantity <= 0) {
        const newItems = state.items.filter((i: any) => i.id !== id);
        saveCartToCookie(newItems);
        return { items: newItems };
      }

      const newItems = state.items.map((i: any) => {
        if (i.id === id) {
          // Validar contra stock
          const maxStock = i.total_stock || 999;
          const validQuantity = Math.min(quantity, maxStock);
          return { ...i, quantity: validQuantity };
        }
        return i;
      });
      
      saveCartToCookie(newItems);
      return { items: newItems };
    });
  },

  clearCart: () => {
    Cookies.remove(CART_COOKIE_KEY);
    set({ items: [] });
  },

  getTotal: () => {
    return get().items.reduce((total: number, item: any) => {
      return total + item.price * item.quantity;
    }, 0);
  },

  getItemCount: () => {
    return get().items.reduce((count: number, item: any) => count + item.quantity, 0);
  },
}));