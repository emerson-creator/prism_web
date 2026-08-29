import type {
  AddCartItemPayload,
  AuthResponse,
  Cart,
  LoginPayload,
  Product,
  ProductsResponse,
  RegisterPayload,
} from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

/**
 * Wrapper central para todas las llamadas a la API.
 * Adjunta el accessToken si existe, y lanza un Error legible
 * en vez de dejar que falle en silencio.
 */
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    // Si tu backend usa cookies para el carrito de invitado, esto es necesario:
    credentials: "include",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Error ${res.status} en ${path}`);
  }

  // DELETE suele devolver 204 sin body
  if (res.status === 204) return undefined as T;

  return res.json();
}

// --- Products ---

export function fetchProducts(params?: { page?: number; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();
  return request<ProductsResponse>(`/products${qs ? `?${qs}` : ""}`);
}

export function fetchProductById(id: string) {
  return request<Product>(`/products/${id}`);
}

// --- Auth ---

export function login(payload: LoginPayload) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function register(payload: RegisterPayload) {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logout() {
  return request<void>("/auth/logout", { method: "POST" });
}

// --- Cart ---
// El carrito no requiere login (confirmado), probablemente usa
// una cookie de sesión propia del backend gracias a credentials: "include".

export function fetchCart() {
  return request<Cart>("/cart");
}

export function addCartItem(payload: AddCartItemPayload) {
  return request<Cart>("/cart/items", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateCartItem(itemId: string, quantity: number) {
  return request<Cart>(`/cart/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(itemId: string) {
  return request<Cart>(`/cart/items/${itemId}`, {
    method: "DELETE",
  });
}

export function clearCart() {
  return request<void>("/cart", { method: "DELETE" });
}
