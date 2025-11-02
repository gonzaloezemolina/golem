import { create } from "zustand";
import Cookies from "js-cookie";

// Clave para la cookie
const CART_COOKIE_KEY = "golem-cart";

// Cargar carrito desde cookie
function loadCartFromCookie() {
  try {
    const cartCookie = Cookies.get(CART_COOKIE_KEY);
    return cartCookie ? JSON.parse(cartCookie) : [];
  } catch (error) {
    console.error("Error al cargar carrito:", error);
    return [];
  }
}

// Guardar carrito en cookie (7 días) - esta funcion setea la cookie y guarda un array en ella
function saveCartToCookie(items: any[]) {
  Cookies.set(CART_COOKIE_KEY, JSON.stringify(items), { expires: 30 });
}

export const useCartStore = create((set, get: any) => ({
  // Estado inicial desde cookie
  items: loadCartFromCookie(),

  // Agregar item
  addItem: (item: any, quantity: number) => {
    set((state: any) => {
      const existingItem = state.items.find((i: any) => i.id === item.id);

      let newItems;
      if (existingItem) {
        // Si ya existe, sumar cantidad
        newItems = state.items.map((i: any) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        // Si no existe, agregar nuevo
        newItems = [...state.items, { ...item, quantity }];
      }

      saveCartToCookie(newItems);
      return { items: newItems };
    });
  },

  // Eliminar item
  removeItem: (id: number) => {
    set((state: any) => {
      const newItems = state.items.filter((i: any) => i.id !== id);
      saveCartToCookie(newItems);
      return { items: newItems };
    });
  },

  // Actualizar cantidad
  updateQuantity: (id: number, quantity: number) => {
    set((state: any) => {
      if (quantity <= 0) {
        // Si la cantidad es 0 o menos, eliminar
        const newItems = state.items.filter((i: any) => i.id !== id);
        saveCartToCookie(newItems);
        return { items: newItems };
      }

      const newItems = state.items.map((i: any) =>
        i.id === id ? { ...i, quantity } : i
      );
      saveCartToCookie(newItems);
      return { items: newItems };
    });
  },

  // Limpiar carrito
  clearCart: () => {
    Cookies.remove(CART_COOKIE_KEY);
    set({ items: [] });
  },

  // Calcular total
  getTotal: () => {
    return get().items.reduce((total: number, item: any) => {
      return total + item.price * item.quantity;
    }, 0);
  },

  // Contar items
  getItemCount: () => {
    return get().items.reduce((count: number, item: any) => count + item.quantity, 0);
  },
}));