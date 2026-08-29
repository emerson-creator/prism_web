import { create } from "zustand";
import * as api from "@/libs/api";
import type { Cart } from "@/libs/types";

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;

  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const cart = await api.fetchCart();
      set({ cart, isLoading: false });
    } catch (err) {
      set({
        error:
          err instanceof Error ? err.message : "No se pudo cargar el carrito",
        isLoading: false,
      });
    }
  },

  addItem: async (productId, quantity = 1) => {
    set({ isLoading: true, error: null });
    try {
      const cart = await api.addCartItem({ productId, quantity });
      set({ cart, isLoading: false });
    } catch (err) {
      set({
        error:
          err instanceof Error ? err.message : "No se pudo agregar el producto",
        isLoading: false,
      });
    }
  },

  updateItem: async (itemId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const cart = await api.updateCartItem(itemId, quantity);
      set({ cart, isLoading: false });
    } catch (err) {
      set({
        error:
          err instanceof Error
            ? err.message
            : "No se pudo actualizar el producto",
        isLoading: false,
      });
    }
  },

  removeItem: async (itemId) => {
    set({ isLoading: true, error: null });
    try {
      const cart = await api.removeCartItem(itemId);
      set({ cart, isLoading: false });
    } catch (err) {
      set({
        error:
          err instanceof Error
            ? err.message
            : "No se pudo eliminar el producto",
        isLoading: false,
      });
    }
  },

  clear: async () => {
    set({ isLoading: true, error: null });
    try {
      await api.clearCart();
      set({ cart: null, isLoading: false });
    } catch (err) {
      set({
        error:
          err instanceof Error ? err.message : "No se pudo vaciar el carrito",
        isLoading: false,
      });
    }
  },
}));

/** Cantidad total de items, para el badge del Header. */
export function useCartCount() {
  return useCartStore(
    (s) => s.cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0,
  );
}
