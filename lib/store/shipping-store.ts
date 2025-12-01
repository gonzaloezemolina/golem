import { create } from "zustand";

const SHIPPING_KEY = "golem-shipping";

// Cargar desde localStorage
function loadShippingFromStorage() {
  if (typeof window === "undefined") return null;
  
  try {
    const data = localStorage.getItem(SHIPPING_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error al cargar shipping:", error);
    return null;
  }
}

// Guardar en localStorage
function saveShippingToStorage(data: any) {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(SHIPPING_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error al guardar shipping:", error);
  }
}

export interface ShippingAddress {
  provinciaId: string;
  provinciaNombre: string;
  codigoPostal: string;
  ciudadNombre: string;
  domicilio: string;
  pisoDepto: string;
  tipoEntrega: "domicilio" | "retiro";
}

export interface ShippingCost {
  costo: number;
  zona: string;
  mensaje: string;
  esGratis: boolean;
}

interface ShippingStore {
  address: ShippingAddress | null;
  cost: ShippingCost | null;
  setAddress: (address: ShippingAddress) => void;
  setCost: (cost: ShippingCost) => void;
  clearShipping: () => void;
  getShippingData: () => { address: ShippingAddress | null; cost: ShippingCost | null };
}

export const useShippingStore = create<ShippingStore>((set, get) => ({
  // Estado inicial desde localStorage
  address: loadShippingFromStorage()?.address || null,
  cost: loadShippingFromStorage()?.cost || null,

  // Guardar dirección
  setAddress: (address) => {
    set({ address });
    const currentCost = get().cost;
    saveShippingToStorage({ address, cost: currentCost });
  },

  // Guardar costo
  setCost: (cost) => {
    set({ cost });
    const currentAddress = get().address;
    saveShippingToStorage({ address: currentAddress, cost });
  },

  // Limpiar todo
  clearShipping: () => {
    localStorage.removeItem(SHIPPING_KEY);
    set({ address: null, cost: null });
  },

  // Obtener todo
  getShippingData: () => {
    return {
      address: get().address,
      cost: get().cost,
    };
  },
}));