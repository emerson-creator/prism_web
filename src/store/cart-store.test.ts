import { beforeEach, describe, expect, it, vi } from "vitest";
import { UnauthenticatedError } from "@/libs/api";
import type { Cart, Product } from "@/libs/types";

vi.mock("@/libs/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/libs/api")>();
  return {
    ...actual,
    fetchCart: vi.fn(),
    addCartItem: vi.fn(),
    updateCartItem: vi.fn(),
    removeCartItem: vi.fn(),
    clearCart: vi.fn(),
  };
});

import * as api from "@/libs/api";
import { useCartStore, useCartCount, useCartTotal } from "./cart-store";

const product: Product = {
  id: "product-1",
  name: "Test product",
  description: "A product for testing",
  price: 25,
  stock: 10,
  sku: "TEST-001",
  imageUrl: null,
  isActive: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  categoryId: "category-1",
  category: "Testing",
};

const cart: Cart = {
  id: "cart-1",
  userId: "user-1",
  checkedOut: false,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  cartItems: [
    {
      id: "item-1",
      cartId: "cart-1",
      productId: product.id,
      quantity: 2,
      product,
    },
  ],
};

describe("useCartStore", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    useCartStore.setState({
      cart: null,
      isLoading: false,
      error: null,
      needsAuth: false,
    });
  });

  it("fetches the cart successfully", async () => {
    vi.mocked(api.fetchCart).mockResolvedValue(cart);

    await useCartStore.getState().fetchCart();

    expect(api.fetchCart).toHaveBeenCalledOnce();
    expect(useCartStore.getState()).toMatchObject({
      cart,
      isLoading: false,
      error: null,
      needsAuth: false,
    });
  });

  it("adds an item with the default quantity", async () => {
    vi.mocked(api.addCartItem).mockResolvedValue(cart);

    await useCartStore.getState().addItem("product-1");

    expect(api.addCartItem).toHaveBeenCalledWith({
      productId: "product-1",
      quantity: 1,
    });
    expect(useCartStore.getState().cart).toEqual(cart);
    expect(useCartStore.getState().isLoading).toBe(false);
  });

  it("adds an item with a custom quantity", async () => {
    vi.mocked(api.addCartItem).mockResolvedValue(cart);

    await useCartStore.getState().addItem("product-1", 3);

    expect(api.addCartItem).toHaveBeenCalledWith({
      productId: "product-1",
      quantity: 3,
    });
  });

  it("updates an item quantity", async () => {
    vi.mocked(api.updateCartItem).mockResolvedValue(cart);

    await useCartStore.getState().updateItem("item-1", 4);

    expect(api.updateCartItem).toHaveBeenCalledWith("item-1", 4);
    expect(useCartStore.getState().cart).toEqual(cart);
  });

  it("removes an item", async () => {
    vi.mocked(api.removeCartItem).mockResolvedValue(cart);

    await useCartStore.getState().removeItem("item-1");

    expect(api.removeCartItem).toHaveBeenCalledWith("item-1");
    expect(useCartStore.getState().cart).toEqual(cart);
  });

  it("clears the cart after a successful request", async () => {
    vi.mocked(api.clearCart).mockResolvedValue(undefined);
    useCartStore.setState({ cart });

    await useCartStore.getState().clear();

    expect(api.clearCart).toHaveBeenCalledOnce();
    expect(useCartStore.getState().cart).toBeNull();
    expect(useCartStore.getState().isLoading).toBe(false);
  });

  it("handles ordinary API errors", async () => {
    vi.mocked(api.fetchCart).mockRejectedValue(new Error("Network error"));

    await useCartStore.getState().fetchCart();

    expect(useCartStore.getState()).toMatchObject({
      error: "Network error",
      isLoading: false,
      needsAuth: false,
    });
  });

  it("marks the session as unauthenticated when the API throws 401", async () => {
    vi.mocked(api.fetchCart).mockRejectedValue(new UnauthenticatedError());

    await useCartStore.getState().fetchCart();

    expect(useCartStore.getState()).toMatchObject({
      error: null,
      isLoading: false,
      needsAuth: true,
    });
  });

  it("uses the fallback error for non-Error values", async () => {
    vi.mocked(api.addCartItem).mockRejectedValue("unexpected");

    await useCartStore.getState().addItem("product-1");

    expect(useCartStore.getState()).toMatchObject({
      error: "No se pudo agregar el producto",
      isLoading: false,
      needsAuth: false,
    });
  });
});

describe("cart selectors", () => {
  beforeEach(() => {
    useCartStore.setState({ cart: null });
  });

  it("returns zero items and total when the cart is empty", async () => {
    const { renderHook } = await import("@testing-library/react");

    const { result: countResult } = renderHook(() => useCartCount());
    const { result: totalResult } = renderHook(() => useCartTotal());

    expect(countResult.current).toBe(0);
    expect(totalResult.current).toBe(0);
  });

  it("calculates the total quantity and price", async () => {
    useCartStore.setState({
      cart: {
        ...cart,
        cartItems: [
          { ...cart.cartItems[0], quantity: 2 },
          {
            ...cart.cartItems[0],
            id: "item-2",
            productId: "product-2",
            quantity: 3,
            product: { ...product, id: "product-2", price: 10 },
          },
        ],
      },
    });

    const { renderHook } = await import("@testing-library/react");

    const { result: countResult } = renderHook(() => useCartCount());
    const { result: totalResult } = renderHook(() => useCartTotal());

    expect(countResult.current).toBe(5);
    expect(totalResult.current).toBe(80);
  });
});
