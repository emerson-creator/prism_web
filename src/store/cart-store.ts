import { create } from "zustand";
import * as api from "@/libs/api";
import { UnauthenticatedError } from "@/libs/api";
import type { Cart } from "@/libs/types";

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  /** true si la última acción falló porque el usuario no está logueado. */
  needsAuth: boolean;

  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
}

/** Aplica el resultado de un error al estado del store, distinguiendo 401. */
function applyError(
  set: (partial: Partial<CartState>) => void,
  err: unknown,
  fallbackMessage: string,
) {
  if (err instanceof UnauthenticatedError) {
    set({ needsAuth: true, error: null, isLoading: false });
    return;
  }
  set({
    error: err instanceof Error ? err.message : fallbackMessage,
    needsAuth: false,
    isLoading: false,
  });
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isLoading: false,
  error: null,
  needsAuth: false,

  fetchCart: async () => {
    set({ isLoading: true, error: null, needsAuth: false });
    try {
      const cart = await api.fetchCart();
      set({ cart, isLoading: false });
    } catch (err) {
      applyError(set, err, "No se pudo cargar el carrito");
    }
  },

  addItem: async (productId, quantity = 1) => {
    set({ isLoading: true, error: null, needsAuth: false });
    try {
      const cart = await api.addCartItem({ productId, quantity });
      set({ cart, isLoading: false });
    } catch (err) {
      applyError(set, err, "No se pudo agregar el producto");
    }
  },

  updateItem: async (itemId, quantity) => {
    set({ isLoading: true, error: null, needsAuth: false });
    try {
      const cart = await api.updateCartItem(itemId, quantity);
      set({ cart, isLoading: false });
    } catch (err) {
      applyError(set, err, "No se pudo actualizar el producto");
    }
  },

  removeItem: async (itemId) => {
    set({ isLoading: true, error: null, needsAuth: false });
    try {
      const cart = await api.removeCartItem(itemId);
      set({ cart, isLoading: false });
    } catch (err) {
      applyError(set, err, "No se pudo eliminar el producto");
    }
  },

  clear: async () => {
    set({ isLoading: true, error: null, needsAuth: false });
    try {
      await api.clearCart();
      set({ cart: null, isLoading: false });
    } catch (err) {
      applyError(set, err, "No se pudo vaciar el carrito");
    }
  },
}));

/** Cantidad total de items, para el badge del Header. */
export function useCartCount() {
  return useCartStore(
    (s) => s.cart?.cartItems.reduce((sum, i) => sum + i.quantity, 0) ?? 0,
  );
}

/** Total en dinero del carrito (no viene del backend, se calcula aquí). */
export function useCartTotal() {
  return useCartStore(
    (s) =>
      s.cart?.cartItems.reduce(
        (sum, i) => sum + Number(i.product.price) * i.quantity,
        0,
      ) ?? 0,
  );
}
