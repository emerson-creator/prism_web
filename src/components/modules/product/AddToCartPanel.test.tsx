import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { Product } from "@/libs/types";

const { pushMock, cartState } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  cartState: {
    addItem: vi.fn(),
    needsAuth: false as boolean,
    error: null as string | null,
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/store/cart-store", () => ({
  useCartStore: Object.assign(
    <T,>(selector: (state: typeof cartState) => T): T =>
      selector(cartState),
    { getState: () => cartState },
  ),
}));

import { AddToCartPanel } from "./AddToCartPanel";

const product: Product = {
  id: "product-1",
  name: "Test shirt",
  description: "A shirt for testing",
  price: 25,
  stock: 5,
  sku: "SHIRT-001",
  imageUrl: null,
  isActive: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  categoryId: "category-1",
  category: "Clothing",
};

beforeEach(() => {
  vi.clearAllMocks();
  cartState.needsAuth = false;
  cartState.error = null;
  cartState.addItem.mockResolvedValue(undefined);
});

describe("AddToCartPanel", () => {
  it("renders the quantity controls and stock information", () => {
    render(<AddToCartPanel product={product} />);

    expect(screen.getByText("Quantity")).toBeTruthy();
    expect(screen.getByText("5 in stock")).toBeTruthy();
    expect(screen.getByText("1", { selector: "span" })).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Add to cart" }),
    ).toBeTruthy();
  });

  it("does not allow decreasing quantity below one", () => {
    render(<AddToCartPanel product={product} />);

    expect(
      screen.getByRole("button", { name: "Decrease quantity" }).hasAttribute("disabled"),
    ).toBe(true);
  });

  it("increases and decreases quantity within valid limits", () => {
    render(<AddToCartPanel product={product} />);

    fireEvent.click(screen.getByRole("button", { name: "Increase quantity" }));
    expect(screen.getByText("2", { selector: "span" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Decrease quantity" }));
    expect(screen.getByText("1", { selector: "span" })).toBeTruthy();
  });

  it("does not allow quantity to exceed available stock", () => {
    render(<AddToCartPanel product={{ ...product, stock: 2 }} />);

    const increaseButton = screen.getByRole("button", {
      name: "Increase quantity",
    });

    fireEvent.click(increaseButton);
    expect(screen.getByText("2", { selector: "span" })).toBeTruthy();
    expect(increaseButton.hasAttribute("disabled")).toBe(true);
  });

  it("adds the selected quantity to the cart", async () => {
    render(<AddToCartPanel product={product} />);

    fireEvent.click(screen.getByRole("button", { name: "Increase quantity" }));
    fireEvent.click(screen.getByRole("button", { name: "Add to cart" }));

    await waitFor(() => {
      expect(cartState.addItem).toHaveBeenCalledWith("product-1", 2);
    });
  });

  it("disables adding when the product is out of stock", () => {
    render(<AddToCartPanel product={{ ...product, stock: 0 }} />);

    expect(screen.getByRole("button", { name: "Out of stock" }).hasAttribute("disabled")).toBe(true);
    expect(screen.queryByRole("button", { name: "Increase quantity" })).toBeNull();
    expect(cartState.addItem).not.toHaveBeenCalled();
  });

  it("shows an error when adding to the cart fails", async () => {
    cartState.addItem.mockImplementation(async () => {
      cartState.error = "Unable to add product";
    });

    render(<AddToCartPanel product={product} />);
    fireEvent.click(screen.getByRole("button", { name: "Add to cart" }));

    expect(await screen.findByText("Unable to add product")).toBeTruthy();
  });

  it("shows a sign-in prompt when authentication is required", async () => {
    cartState.addItem.mockImplementation(async () => {
      cartState.needsAuth = true;
    });

    render(<AddToCartPanel product={product} />);
    fireEvent.click(screen.getByRole("button", { name: "Add to cart" }));

    expect(await screen.findByText("to add items to your cart.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(pushMock).toHaveBeenCalledWith("/login");
  });
});
