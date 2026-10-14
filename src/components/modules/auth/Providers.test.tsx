import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";

const { authState, cartState } = vi.hoisted(() => ({
  authState: {
    hydrate: vi.fn(),
    isHydrated: false,
    user: null as { id: string; email: string } | null,
  },
  cartState: {
    fetchCart: vi.fn(),
  },
}));

vi.mock("@/store/auth-store", () => ({
  useAuthStore: Object.assign(
    <T,>(selector: (state: typeof authState) => T): T =>
      selector(authState),
    { getState: () => authState },
  ),
}));

vi.mock("@/store/cart-store", () => ({
  useCartStore: Object.assign(
    <T,>(selector: (state: typeof cartState) => T): T =>
      selector(cartState),
    { getState: () => cartState },
  ),
}));

import { Providers } from "./Providers";

describe("Providers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.isHydrated = false;
    authState.user = null;
  });

  it("renders its children", () => {
    const { getByText } = render(
      <Providers>
        <div>Test content</div>
      </Providers>,
    );

    expect(getByText("Test content")).toBeTruthy();
  });

  it("hydrates the authentication store on mount", () => {
    render(
      <Providers>
        <div>App</div>
      </Providers>,
    );

    expect(authState.hydrate).toHaveBeenCalledTimes(1);
  });

  it("does not fetch the cart before hydration", () => {
    authState.isHydrated = false;
    authState.user = { id: "user-1", email: "user@example.com" };

    render(
      <Providers>
        <div>App</div>
      </Providers>,
    );

    expect(cartState.fetchCart).not.toHaveBeenCalled();
  });

  it("does not fetch the cart when no user is logged in", () => {
    authState.isHydrated = true;
    authState.user = null;

    render(
      <Providers>
        <div>App</div>
      </Providers>,
    );

    expect(cartState.fetchCart).not.toHaveBeenCalled();
  });

  it("fetches the cart when the session is hydrated and a user exists", async () => {
    authState.isHydrated = true;
    authState.user = { id: "user-1", email: "user@example.com" };

    render(
      <Providers>
        <div>App</div>
      </Providers>,
    );

    await waitFor(() => {
      expect(cartState.fetchCart).toHaveBeenCalledTimes(1);
    });
  });

  it("does not fetch the cart more than once on initial mount", async () => {
    authState.isHydrated = true;
    authState.user = { id: "user-1", email: "user@example.com" };

    render(
      <Providers>
        <div>App</div>
      </Providers>,
    );

    await waitFor(() => {
      expect(cartState.fetchCart).toHaveBeenCalledTimes(1);
    });
  });
});
