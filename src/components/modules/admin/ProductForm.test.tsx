import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { Category, Product } from "@/libs/types";

const { pushMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/libs/api", () => ({
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  uploadProductImage: vi.fn(),
}));

import * as api from "@/libs/api";
import { ProductForm } from "./ProductForm";

const categories: Category[] = [
  {
    id: "category-1",
    name: "Clothing",
    slug: "clothing",
  },
  {
    id: "category-2",
    name: "Accessories",
    slug: "accessories",
  },
];

const product: Product = {
  id: "product-1",
  name: "Test shirt",
  description: "A shirt for testing",
  price: 25,
  stock: 10,
  sku: "SHIRT-001",
  imageUrl: "https://example.com/shirt.jpg",
  isActive: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  categoryId: "category-1",
  category: "Clothing",
};

function fillValidForm() {
  const fields = screen.getAllByRole("textbox");

  fireEvent.change(fields[0], { target: { value: "New shirt" } });
  fireEvent.change(fields[1], {
    target: { value: "A new shirt description" },
  });
  fireEvent.change(fields[2], { target: { value: "35.50" } });
  fireEvent.change(fields[3], { target: { value: "8" } });
  fireEvent.change(fields[4], { target: { value: "SHIRT-002" } });

  fireEvent.change(screen.getByRole("combobox"), {
    target: { value: "category-1" },
  });
}

describe("ProductForm", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders the form fields and available categories", () => {
    render(<ProductForm categories={categories} />);

    expect(screen.getByText("Product image")).toBeTruthy();
    expect(screen.getByText("Name")).toBeTruthy();
    expect(screen.getByText("Description")).toBeTruthy();
    expect(screen.getByText("Price (USD)")).toBeTruthy();
    expect(screen.getByText("Stock")).toBeTruthy();
    expect(screen.getByText("SKU")).toBeTruthy();
    expect(screen.getByRole("option", { name: "Clothing" })).toBeTruthy();
    expect(
      screen.getByRole("option", { name: "Accessories" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Create product" }),
    ).toBeTruthy();
  });

  it("shows validation errors when required fields are empty", async () => {
    render(<ProductForm categories={categories} />);

    fireEvent.click(screen.getByRole("button", { name: "Create product" }));

    expect(await screen.findByText("Name is required")).toBeTruthy();
    expect(screen.getByText("Enter a valid price")).toBeTruthy();
    expect(screen.getByText("Enter a valid stock quantity")).toBeTruthy();
    expect(screen.getByText("SKU is required")).toBeTruthy();
    expect(screen.getByText("Category is required")).toBeTruthy();

    expect(api.createProduct).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("rejects negative price and stock values", async () => {
    render(<ProductForm categories={categories} />);
    fillValidForm();

    const fields = screen.getAllByRole("textbox");
    fireEvent.change(fields[2], { target: { value: "-1" } });
    fireEvent.change(fields[3], { target: { value: "-2" } });

    fireEvent.click(screen.getByRole("button", { name: "Create product" }));

    expect(await screen.findByText("Enter a valid price")).toBeTruthy();
    expect(screen.getByText("Enter a valid stock quantity")).toBeTruthy();
    expect(api.createProduct).not.toHaveBeenCalled();
  });

  it("creates a product with the expected payload", async () => {
    vi.mocked(api.createProduct).mockResolvedValue(product);

    render(<ProductForm categories={categories} />);
    fillValidForm();

    fireEvent.click(screen.getByRole("button", { name: "Create product" }));

    await waitFor(() => {
      expect(api.createProduct).toHaveBeenCalledWith({
        name: "New shirt",
        description: "A new shirt description",
        price: 35.5,
        stock: 8,
        sku: "SHIRT-002",
        categoryId: "category-1",
        isActive: true,
        imageUrl: undefined,
      });
    });

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/admin/products");
    });
  });

  it("creates an inactive product when the active checkbox is unchecked", async () => {
    vi.mocked(api.createProduct).mockResolvedValue(product);

    render(<ProductForm categories={categories} />);
    fillValidForm();

    fireEvent.click(
      screen.getByRole("checkbox", { name: /Active/ }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Create product" }));

    await waitFor(() => {
      expect(api.createProduct).toHaveBeenCalledWith(
        expect.objectContaining({ isActive: false }),
      );
    });
  });

  it("prepopulates fields and updates an existing product", async () => {
    vi.mocked(api.updateProduct).mockResolvedValue(product);

    render(
      <ProductForm categories={categories} initialProduct={product} />,
    );

    expect(screen.getByRole("button", { name: "Save changes" })).toBeTruthy();

    const fields = screen.getAllByRole("textbox");
    expect((fields[0] as HTMLInputElement).value).toBe("Test shirt");
    expect((fields[2] as HTMLInputElement).value).toBe("25");
    expect((fields[3] as HTMLInputElement).value).toBe("10");
    expect((fields[4] as HTMLInputElement).value).toBe("SHIRT-001");

    fireEvent.change(fields[0], {
      target: { value: "Updated shirt" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(api.updateProduct).toHaveBeenCalledWith(
        "product-1",
        expect.objectContaining({
          name: "Updated shirt",
          price: 25,
          stock: 10,
          sku: "SHIRT-001",
          categoryId: "category-1",
        }),
      );
    });

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/admin/products");
    });

    expect(api.createProduct).not.toHaveBeenCalled();
  });

  it("shows the API error when saving fails", async () => {
    vi.mocked(api.createProduct).mockRejectedValue(
      new Error("SKU already exists"),
    );

    render(<ProductForm categories={categories} />);
    fillValidForm();

    fireEvent.click(screen.getByRole("button", { name: "Create product" }));

    expect(await screen.findByText("SKU already exists")).toBeTruthy();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("navigates back when cancel is clicked", () => {
    render(<ProductForm categories={categories} />);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(pushMock).toHaveBeenCalledWith("/admin/products");
    expect(api.createProduct).not.toHaveBeenCalled();
  });
});
