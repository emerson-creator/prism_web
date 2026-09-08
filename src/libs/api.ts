import type {
  AddCartItemPayload,
  AdminUpdateUserPayload,
  ApiResponse,
  AuthResponse,
  Cart,
  CategoriesResponse,
  Category,
  ChangePasswordPayload,
  ConfirmPaymentPayload,
  CreateCategoryPayload,
  CreatePaymentIntentData,
  CreatePaymentIntentPayload,
  CreateProductPayload,
  LoginPayload,
  MessageResponse,
  Order,
  OrdersQuery,
  OrderSummary,
  PaginatedOrders,
  Payment,
  Product,
  ProductsResponse,
  RegisterPayload,
  ShippingAddress,
  UpdateCategoryPayload,
  UpdateProductPayload,
  UpdateProfilePayload,
  UploadImageData,
  User,
} from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

/** Thrown when the user has no valid session at all (no token, or refresh also failed). */
export class UnauthenticatedError extends Error {
  constructor(message = "You need to sign in") {
    super(message);
    this.name = "UnauthenticatedError";
  }
}

/**
 * Fired when a refresh attempt fails for real (refresh token itself is
 * invalid/expired). auth-store listens for this to clear its in-memory
 * user, since api.ts intentionally doesn't import any store directly.
 */
const SESSION_EXPIRED_EVENT = "prism:session-expired";

export function onSessionExpired(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(SESSION_EXPIRED_EVENT, callback);
  return () => window.removeEventListener(SESSION_EXPIRED_EVENT, callback);
}

function emitSessionExpired() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  }
}

function getStoredToken(name: "accessToken" | "refreshToken"): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(name);
}

/**
 * Single-flight refresh: if multiple requests 401 around the same time,
 * only one actual /auth/refresh call is made. Every caller awaits the
 * same in-flight promise instead of racing separate refresh calls.
 */
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = getStoredToken("refreshToken");
    if (!refreshToken) throw new UnauthenticatedError();

    // RefreshTokenGuard expects the refresh token as a Bearer header,
    // not in the body — same pattern as any other protected endpoint,
    // just validated against the refresh token instead of the access one.
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
      credentials: "include",
    });

    if (!res.ok) {
      // Refresh token itself is invalid/expired — no way to recover silently.
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      emitSessionExpired();
      throw new UnauthenticatedError();
    }

    // authService.refresh() returns the same AuthResponseDto shape as
    // login/register: { accessToken, refreshToken, user }.
    const data: { accessToken: string; refreshToken: string } =
      await res.json();
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data.accessToken;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

/**
 * Central wrapper for every API call. Attaches the accessToken, and on
 * a 401 tries a one-time silent refresh + retry before giving up.
 */
async function request<T>(
  path: string,
  options: RequestInit = {},
  _isRetry = false,
): Promise<T> {
  const token = getStoredToken("accessToken");

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
    // Already retried once, or there was never a token to refresh from
    // → this is a real "not authenticated" state, not a stale token.
    if (_isRetry || !getStoredToken("refreshToken")) {
      throw new UnauthenticatedError();
    }

    try {
      await refreshAccessToken();
    } catch {
      throw new UnauthenticatedError();
    }

    // Retry the original request exactly once, with the new token.
    return request<T>(path, options, true);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Error ${res.status} on ${path}`);
  }

  // DELETE usually returns 204 with no body
  if (res.status === 204) return undefined as T;

  return res.json();
}

/**
 * Same auth/refresh handling as request(), but for multipart/form-data
 * uploads — we must NOT set Content-Type ourselves, the browser needs
 * to add the multipart boundary automatically.
 */
async function requestFormData<T>(
  path: string,
  formData: FormData,
  _isRetry = false,
): Promise<T> {
  const token = getStoredToken("accessToken");

  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
    credentials: "include",
  });

  if (res.status === 401) {
    if (_isRetry || !getStoredToken("refreshToken")) {
      throw new UnauthenticatedError();
    }
    try {
      await refreshAccessToken();
    } catch {
      throw new UnauthenticatedError();
    }
    return requestFormData<T>(path, formData, true);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Error ${res.status} on ${path}`);
  }

  return res.json();
}

// --- Products ---

export interface FetchProductsParams {
  page?: number;
  limit?: number;
  category?: string; // matches by category NAME, not categoryId (confirmed via ProductsService.findAll)
  search?: string; // matches name OR description, case-insensitive
  isActive?: boolean;
}

export function fetchProducts(params?: FetchProductsParams) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.category) query.set("category", params.category);
  if (params?.search) query.set("search", params.search);
  if (params?.isActive !== undefined)
    query.set("isActive", String(params.isActive));
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
  const res = await request<ApiResponse<CreatePaymentIntentData>>(
    "/payments/create-intent",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  return res.data;
}

export async function confirmPayment(payload: ConfirmPaymentPayload) {
  const res = await request<ApiResponse<Payment>>("/payments/confirm", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data;
}

// --- Order history ---
// GET /orders/my-orders and GET /orders/:id both wrap their data in
// { success, data, message } via OrderApiResponseDto.

export async function fetchMyOrders(params?: OrdersQuery) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.status) query.set("status", params.status);
  if (params?.search) query.set("search", params.search);
  const qs = query.toString();

  const res = await request<ApiResponse<PaginatedOrders>>(
    `/orders/my-orders${qs ? `?${qs}` : ""}`,
  );
  return res.data;
}

export async function fetchOrderById(id: string) {
  const res = await request<ApiResponse<OrderSummary>>(`/orders/${id}`);
  return res.data;
}

/**
 * Cancels the current user's own order. Backend only allows this while
 * status is PENDING (enforced server-side in OrdersService.cancel) —
 * paid orders (PROCESSING+) are rejected with a 400, since cancelling
 * those would require an actual Stripe refund, which isn't handled here.
 */
export async function cancelOrder(id: string) {
  const res = await request<ApiResponse<OrderSummary>>(`/orders/${id}`, {
    method: "DELETE",
  });
  return res.data;
}

// --- Admin: Orders ---
// GET /orders/admin/all wraps its data the same way as my-orders
// (OrderApiResponseDto<PaginatedOrderResponseDto>). Requires ADMIN role.

export async function fetchAllOrdersAdmin(params?: OrdersQuery) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.status) query.set("status", params.status);
  const qs = query.toString();

  const res = await request<ApiResponse<PaginatedOrders>>(
    `/orders/admin/all${qs ? `?${qs}` : ""}`,
  );
  return res.data;
}

// --- User profile ---
// GET/PATCH /users/profile return the User shape directly (no envelope).

export function fetchProfile() {
  return request<User>("/users/profile");
}

export function updateProfile(payload: UpdateProfilePayload) {
  return request<User>("/users/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function changePassword(payload: ChangePasswordPayload) {
  return request<MessageResponse>("/users/profile/password", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// --- Admin: Products ---
// All three require JwtAuthGuard + Roles(ADMIN) on the backend.

export function createProduct(payload: CreateProductPayload) {
  return request<Product>("/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateProduct(id: string, payload: UpdateProductPayload) {
  return request<Product>(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteProduct(id: string) {
  return request<void>(`/products/${id}`, { method: "DELETE" });
}

/** Uploads a product photo to Cloudinary via the backend; returns a URL to use as imageUrl. */
export function uploadProductImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return requestFormData<UploadImageData>("/products/upload-image", formData);
}

// --- Admin: Categories ---
// GET / is public; create/update/delete require ADMIN.

export function fetchCategories(params?: { page?: number; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();
  return request<CategoriesResponse>(`/categories${qs ? `?${qs}` : ""}`);
}

export function createCategory(payload: CreateCategoryPayload) {
  return request<Category>("/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateCategory(id: string, payload: UpdateCategoryPayload) {
  return request<Category>(`/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteCategory(id: string) {
  return request<MessageResponse>(`/categories/${id}`, { method: "DELETE" });
}

// --- Admin: Users ---
// All three require JwtAuthGuard + Roles(ADMIN) on the backend.

export function fetchAllUsers() {
  return request<User[]>("/users");
}

export function adminUpdateUser(id: string, payload: AdminUpdateUserPayload) {
  return request<User>(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function adminDeleteUser(id: string) {
  return request<MessageResponse>(`/users/${id}`, { method: "DELETE" });
}
