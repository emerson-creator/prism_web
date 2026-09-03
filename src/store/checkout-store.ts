import { create } from "zustand";
import * as api from "@/libs/api";
import type {
  CreatePaymentIntentData,
  Order,
  Payment,
  ShippingAddress,
} from "@/libs/types";

interface CheckoutState {
  shippingAddress: ShippingAddress | null;
  order: Order | null;
  paymentIntent: CreatePaymentIntentData | null;
  payment: Payment | null;

  isLoading: boolean;
  error: string | null;

  /** Step 1: send shipping info, converts the cart into an Order. */
  submitShipping: (address: ShippingAddress) => Promise<boolean>;
  /** Step 2: ask the backend for a Stripe client secret for that order. */
  startPayment: () => Promise<boolean>;
  /** Step 3: confirm the payment after Stripe Elements succeeds client-side. */
  confirm: (paymentIntentId: string) => Promise<boolean>;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  shippingAddress: null,
  order: null,
  paymentIntent: null,
  payment: null,
  isLoading: false,
  error: null,

  submitShipping: async (address) => {
    set({ isLoading: true, error: null });
    try {
      const order = await api.checkoutCart(address);
      set({ shippingAddress: address, order, isLoading: false });
      return true;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Checkout failed",
        isLoading: false,
      });
      return false;
    }
  },

  startPayment: async () => {
    const order = get().order;
    if (!order) {
      set({ error: "No order to pay for yet" });
      return false;
    }
    set({ isLoading: true, error: null });
    try {
      const paymentIntent = await api.createPaymentIntent({
        orderId: order.id,
      });
      set({ paymentIntent, isLoading: false });
      return true;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Could not start payment",
        isLoading: false,
      });
      return false;
    }
  },

  confirm: async (paymentIntentId) => {
    const order = get().order;
    if (!order) {
      set({ error: "No order to confirm" });
      return false;
    }
    set({ isLoading: true, error: null });
    try {
      const payment = await api.confirmPayment({
        paymentIntentId,
        orderId: order.id,
      });
      set({ payment, isLoading: false });
      return true;
    } catch (err) {
      set({
        error:
          err instanceof Error ? err.message : "Payment confirmation failed",
        isLoading: false,
      });
      return false;
    }
  },

  reset: () =>
    set({
      shippingAddress: null,
      order: null,
      paymentIntent: null,
      payment: null,
      error: null,
    }),
}));
