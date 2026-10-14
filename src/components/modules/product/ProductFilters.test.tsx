import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Category } from "@/libs/types";

const { replaceMock, navigationState } = vi.hoisted(() => ({
  replaceMock: vi.fn(),
  navigationState: { search: "" },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
  useSearchParams: () => new URLSearchParams(navigationState.search),
}));

import { ProductFilters } from "./ProductFilters";

const categories = [
  { id: "cat-1", name: "Clothing" },
  { id: "cat-2", name: "Shoes" },
] as Category[];

beforeEach(() => {
  vi.clearAllMocks();
  navigationState.search = "";
});

afterEach(() => {
  vi.useRealTimers();
});

describe("ProductFilters", () => {
  it("renders the search input and category filters", () => {
    render(<ProductFilters categories={categories} />);

    expect(screen.getByRole("textbox")).toBeTruthy();
    expect(screen.getByRole("button", { name: "All" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Clothing" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Shoes" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /^Clear$/ })).toBeNull();
  });

  it("updates the category and resets pagination while preserving other parameters", () => {
    navigationState.search = "search=shirt&page=3&sort=price";

    render(<ProductFilters categories={categories} />);

    fireEvent.click(screen.getByRole("button", { name: "Shoes" }));

    expect(replaceMock).toHaveBeenCalledWith(
      "/products?search=shirt&sort=price&category=Shoes",
      { scroll: false },
    );
  });

  it("removes the category when selecting All", () => {
    navigationState.search = "search=shirt&category=Clothing&page=2";

    render(<ProductFilters categories={categories} />);

    fireEvent.click(screen.getByRole("button", { name: "All" }));

    expect(replaceMock).toHaveBeenCalledWith(
      "/products?search=shirt",
      { scroll: false },
    );
  });

  it("commits a search after 400 milliseconds and resets pagination", async () => {
    vi.useFakeTimers();
    navigationState.search = "category=Shoes&page=2&sort=price";

    render(<ProductFilters categories={categories} />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "hoodie" },
    });

    await act(async () => {
      vi.advanceTimersByTime(399);
    });

    expect(replaceMock).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(1);
    });

    expect(replaceMock).toHaveBeenCalledWith(
      "/products?category=Shoes&sort=price&search=hoodie",
      { scroll: false },
    );
  });

  it("clears the search immediately while preserving the category", () => {
    navigationState.search = "search=shirt&category=Shoes&page=4";

    render(<ProductFilters categories={categories} />);

    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));

    expect(replaceMock).toHaveBeenCalledWith(
      "/products?category=Shoes",
      { scroll: false },
    );
  });

  it("clears all filters when Clear is clicked", () => {
    navigationState.search = "search=shirt&category=Clothing&page=3";

    render(<ProductFilters categories={categories} />);

    fireEvent.click(screen.getByRole("button", { name: /^Clear$/ }));

    expect(replaceMock).toHaveBeenCalledWith("/products", {
      scroll: false,
    });
  });

  it("removes the search parameter when the search is empty", async () => {
    vi.useFakeTimers();
    navigationState.search = "search=shirt&category=Shoes";

    render(<ProductFilters categories={categories} />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "" },
    });

    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    expect(replaceMock).toHaveBeenCalledWith(
      "/products?category=Shoes",
      { scroll: false },
    );
  });
});
