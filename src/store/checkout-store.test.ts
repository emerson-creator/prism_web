import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  CreatePaymentIntentData,
  Order,
  Payment,
  ShippingAddress,
} from "@/libs/types";

vi.mock("@/libs/api", () => ({
  checkoutCart: vi.fn(),
  createPaymentIntent: vi.fn(),
  confirmPayment: vi.fn(),
}));

import * as api from "@/libs/api";
import { useCheckoutStore } from "./checkout-store";

const address: ShippingAddress = {
  fullName: "Test User",
  street: "123 Test Street",
  city: "Bogota",
  state: "Cundinamarca",
  zipCode: "110111",
  country: "Colombia",
  phone: "3001234567",
};

const order: Order = {
  id: "order-1",
  userId: "user-1",
  totalAmount: 100,
  total: 100,
  shippingAddress: "123 Test Street, Bogota, Colombia",
  orderItems: [],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const paymentIntent: CreatePaymentIntentData = {
  clientSecret: "test_client_secret",
  paymentId: "payment-1",
};

const payment: Payment = {
  id: "payment-1",
  orderId: "order-1",
  amount: 100,
  userId: "user-1",
  currency: "usd",
  status: "COMPLETED",
  paymentMethod: "card",
  transactionId: "pi_test_123",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("useCheckoutStore", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    useCheckoutStore.getState().reset();
    useCheckoutStore.setState({
      isLoading: false,
      error: null,
    });
  });

  it("submits shipping information successfully", async () => {
    vi.mocked(api.checkoutCart).mockResolvedValue(order);

    const result = await useCheckoutStore.getState().submitShipping(address);

    expect(result).toBe(true);
    expect(api.checkoutCart).toHaveBeenCalledWith(address);
    expect(useCheckoutStore.getState()).toMatchObject({
      shippingAddress: address,
      order,
      isLoading: false,
      error: null,
    });
  });

  it("handles shipping submission errors", async () => {
    vi.mocked(api.checkoutCart).mockRejectedValue(
      new Error("Checkout failed"),
    );

    const result = await useCheckoutStore.getState().submitShipping(address);

    expect(result).toBe(false);
    expect(useCheckoutStore.getState()).toMatchObject({
      shippingAddress: null,
      order: null,
      isLoading: false,
      error: "Checkout failed",
    });
  });

  it("uses a fallback message for unexpected shipping errors", async () => {
    vi.mocked(api.checkoutCart).mockRejectedValue("unexpected");

    const result = await useCheckoutStore.getState().submitShipping(address);

    expect(result).toBe(false);
    expect(useCheckoutStore.getState().error).toBe("Checkout failed");
  });

  it("does not start payment when there is no order", async () => {
    const result = await useCheckoutStore.getState().startPayment();

    expect(result).toBe(false);
    expect(api.createPaymentIntent).not.toHaveBeenCalled();
    expect(useCheckoutStore.getState().error).toBe(
      "No order to pay for yet",
    );
  });

  it("creates a payment intent for the current order", async () => {
    useCheckoutStore.setState({ order });
    vi.mocked(api.createPaymentIntent).mockResolvedValue(paymentIntent);

    const result = await useCheckoutStore.getState().startPayment();

    expect(result).toBe(true);
    expect(api.createPaymentIntent).toHaveBeenCalledWith({
      orderId: order.id,
    });
    expect(useCheckoutStore.getState()).toMatchObject({
      paymentIntent,
      isLoading: false,
      error: null,
    });
  });

  it("handles payment intent creation errors", async () => {
    useCheckoutStore.setState({ order });
    vi.mocked(api.createPaymentIntent).mockRejectedValue(
      new Error("Stripe unavailable"),
    );

    const result = await useCheckoutStore.getState().startPayment();

    expect(result).toBe(false);
    expect(useCheckoutStore.getState()).toMatchObject({
      paymentIntent: null,
      isLoading: false,
      error: "Stripe unavailable",
    });
  });

  it("uses a fallback message for unexpected payment intent errors", async () => {
    useCheckoutStore.setState({ order });
    vi.mocked(api.createPaymentIntent).mockRejectedValue("unexpected");

    const result = await useCheckoutStore.getState().startPayment();

    expect(result).toBe(false);
    expect(useCheckoutStore.getState().error).toBe(
      "Could not start payment",
    );
  });

  it("does not confirm payment when there is no order", async () => {
    const result = await useCheckoutStore.getState().confirm("pi_test_123");

    expect(result).toBe(false);
    expect(api.confirmPayment).not.toHaveBeenCalled();
    expect(useCheckoutStore.getState().error).toBe("No order to confirm");
  });

  it("confirms payment for the current order", async () => {
    useCheckoutStore.setState({ order });
    vi.mocked(api.confirmPayment).mockResolvedValue(payment);

    const result = await useCheckoutStore.getState().confirm("pi_test_123");

    expect(result).toBe(true);
    expect(api.confirmPayment).toHaveBeenCalledWith({
      paymentIntentId: "pi_test_123",
      orderId: order.id,
    });
    expect(useCheckoutStore.getState()).toMatchObject({
      payment,
      isLoading: false,
      error: null,
    });
  });

  it("handles payment confirmation errors", async () => {
    useCheckoutStore.setState({ order });
    vi.mocked(api.confirmPayment).mockRejectedValue(
      new Error("Payment declined"),
    );

    const result = await useCheckoutStore.getState().confirm("pi_test_123");

    expect(result).toBe(false);
    expect(useCheckoutStore.getState()).toMatchObject({
      payment: null,
      isLoading: false,
      error: "Payment declined",
    });
  });

  it("uses a fallback message for unexpected confirmation errors", async () => {
    useCheckoutStore.setState({ order });
    vi.mocked(api.confirmPayment).mockRejectedValue("unexpected");

    const result = await useCheckoutStore.getState().confirm("pi_test_123");

    expect(result).toBe(false);
    expect(useCheckoutStore.getState().error).toBe(
      "Payment confirmation failed",
    );
  });

  it("resets all checkout data", () => {
    useCheckoutStore.setState({
      shippingAddress: address,
      order,
      paymentIntent,
      payment,
      isLoading: false,
      error: "Previous error",
    });

    useCheckoutStore.getState().reset();

    expect(useCheckoutStore.getState()).toMatchObject({
      shippingAddress: null,
      order: null,
      paymentIntent: null,
      payment: null,
      isLoading: false,
      error: null,
    });
  });
});
