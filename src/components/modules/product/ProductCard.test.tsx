import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import type { Product } from "@/libs/types";

const { addItemMock } = vi.hoisted(() => ({
  addItemMock: vi.fn(),
}));

vi.mock("@/store/cart-store", () => ({
  useCartStore: (selector: (state: { addItem: typeof addItemMock }) => unknown) =>
    selector({ addItem: addItemMock }),
}));

vi.mock("next/image", () => ({
  default: (props: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={props.src} alt={props.alt} />
  ),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
    className?: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { ProductCard } from "./ProductCard";

const product = {
  id: "product-1",
  name: "Classic T-Shirt",
  category: "Clothing",
  price: 29.99,
  stock: 10,
  imageUrl: "https://example.com/t-shirt.jpg",
} as Product;

beforeEach(() => {
  vi.clearAllMocks();
  addItemMock.mockResolvedValue(undefined);
});

describe("ProductCard", () => {
  it("renders product information and formatted price", () => {
    render(<ProductCard product={product} />);

    expect(screen.getByText("Classic T-Shirt")).toBeTruthy();
    expect(screen.getByText("Clothing")).toBeTruthy();
    expect(screen.getByText("$29.99")).toBeTruthy();
    expect(screen.getByRole("link").getAttribute("href")).toBe(
      "/products/product-1",
    );
  });

  it("renders the product image when an image URL exists", () => {
    render(<ProductCard product={product} />);

    expect(
      screen.getByRole("img", { name: product.name }).getAttribute("src"),
    ).toBe(product.imageUrl);
  });

  it("renders a placeholder when the product has no image", () => {
    render(<ProductCard product={{ ...product, imageUrl: "" } as Product} />);

    expect(screen.queryByRole("img")).toBeNull();
    expect(document.querySelector("svg")).not.toBeNull();
  });

  it("shows the out-of-stock label and disables adding to cart", () => {
    render(<ProductCard product={{ ...product, stock: 0 } as Product} />);

    expect(screen.getByText("Out of stock")).toBeTruthy();

    const button = screen.getByRole("button", {
      name: "Add Classic T-Shirt to cart",
    }) as HTMLButtonElement;

    expect(button.disabled).toBe(true);
  });

  it("adds one unit to the cart and displays confirmation", async () => {
    render(<ProductCard product={product} />);

    fireEvent.click(
      screen.getByRole("button", { name: "Add Classic T-Shirt to cart" }),
    );

    await waitFor(() => {
      expect(addItemMock).toHaveBeenCalledWith("product-1", 1);
    });

    expect(await screen.findByText(/Added/)).toBeTruthy();
  });

  it("disables the button while adding the product", async () => {
    let resolveAdd!: () => void;

    addItemMock.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveAdd = resolve;
        }),
    );

    render(<ProductCard product={product} />);

    const button = screen.getByRole("button", {
      name: "Add Classic T-Shirt to cart",
    }) as HTMLButtonElement;

    fireEvent.click(button);

    await waitFor(() => {
      expect(button.disabled).toBe(true);
    });

    resolveAdd();

    await waitFor(() => {
      expect(button.disabled).toBe(false);
    });
  });

  it("does not allow adding a product with negative stock", () => {
    render(<ProductCard product={{ ...product, stock: -1 } as Product} />);

    expect(screen.getByText("Out of stock")).toBeTruthy();

    const button = screen.getByRole("button", {
      name: "Add Classic T-Shirt to cart",
    }) as HTMLButtonElement;

    expect(button.disabled).toBe(true);
    expect(addItemMock).not.toHaveBeenCalled();
  });
});
