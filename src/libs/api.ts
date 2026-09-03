import type {
  AddCartItemPayload,
  ApiEnvelope,
  AuthResponse,
  Cart,
  ConfirmPaymentPayload,
  CreatePaymentIntentData,
  CreatePaymentIntentPayload,
  LoginPayload,
  Order,
  Payment,
  Product,
  ProductsResponse,
  RegisterPayload,
  ShippingAddress,
} from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

/** Error específico para 401, así el UI puede reaccionar distinto (ej. mostrar login). */
export class UnauthenticatedError extends Error {
  constructor(message = "Debes iniciar sesión") {
    super(message);
    this.name = "UnauthenticatedError";
  }
}

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
    credentials: "include",
  });

  if (res.status === 401) {
    throw new UnauthenticatedError();
  }

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
// Requiere estar autenticado (JwtAuthGuard a nivel de controller).
// Si no hay accessToken válido, request() lanza UnauthenticatedError.

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

/**
 * Flattens the structured form address into the single string the
 * backend actually stores (CheckoutDto.shippingAddress is plain text).
 */
function formatShippingAddress(address: ShippingAddress): string {
  const parts = [
    address.fullName,
    address.street,
    `${address.city}, ${address.state} ${address.zipCode}`,
    address.country,
    address.phone ? `Phone: ${address.phone}` : null,
  ].filter(Boolean);
  return parts.join(" — ");
}

export function checkoutCart(address: ShippingAddress) {
  return request<Order>("/cart/checkout", {
    method: "POST",
    body: JSON.stringify({ shippingAddress: formatShippingAddress(address) }),
  });
}

// --- Payments ---
// These endpoints wrap their response in { success, message, data }.
// NOTE: createPaymentIntent does NOT send `amount` — the backend always
// computes it server-side from order.total, ignoring any client value.

export async function createPaymentIntent(payload: CreatePaymentIntentPayload) {
  const res = await request<ApiEnvelope<CreatePaymentIntentData>>(
    "/payments/create-intent",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  return res.data;
}

export async function confirmPayment(payload: ConfirmPaymentPayload) {
  const res = await request<ApiEnvelope<Payment>>("/payments/confirm", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data;
}
