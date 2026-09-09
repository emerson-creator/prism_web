// Tipos derivados de la respuesta real de la API (Swagger)

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  category: string;
}

export interface ProductsMeta {
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductsResponse {
  data: Product[];
  meta: ProductsMeta;
}

export type Role = "ADMIN" | "USER";

export interface User {
  id: string;
  email: string;
  name: string | null;
  lastName: string | null;
  Role: Role;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  lastName: string;
}

// --- Cart ---
// Shape real, tomado de CartService (Prisma): el campo es `cartItems`,
// no `items`, y no hay `total` en la respuesta — se calcula en el front.

export interface CartItem {
  id: string; // id del CartItem, para PATCH/DELETE /cart/items/{itemId}
  cartId: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  userId: string;
  checkedOut: boolean;
  createdAt: string;
  updatedAt: string;
  cartItems: CartItem[];
}

export interface AddCartItemPayload {
  productId: string;
  quantity: number;
}

// --- Checkout / Orders ---

/**
 * The form collects a structured address for a better UX, but the
 * backend's CheckoutDto stores `shippingAddress` as a single string
 * (confirmed from CartService/OrdersService — it's persisted and read
 * back as plain text, not a nested object). We flatten this shape into
 * one string in api.ts's checkoutCart() before sending it.
 */
export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

/** What actually goes over the wire to POST /cart/checkout. */
export interface CheckoutPayload {
  shippingAddress: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName?: string; // present when read back via OrdersService.formatOrderResponse
  quantity: number;
  price: number;
  subtotal?: number;
}

// Confirmed from schema.prisma's OrderStatus enum — NOT "COMPLETED".
export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED";

export interface Order {
  id: string;
  userId: string;
  cartId?: string;
  status?: OrderStatus; // present on orders read back via OrdersService
  totalAmount: number;
  total: number;
  shippingAddress: string;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// --- Payments (Stripe) ---

export interface CreatePaymentIntentPayload {
  orderId: string;
  currency?: string;
  description?: string;
  // NOTE: no `amount` here — PaymentsService always computes it
  // server-side from order.total, ignoring any client-provided value.
}

export interface CreatePaymentIntentData {
  clientSecret: string;
  paymentId: string;
}

export interface ConfirmPaymentPayload {
  paymentIntentId: string;
  orderId: string;
}

// Confirmed from schema.prisma's PaymentStatus enum.
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  userId: string;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string | null;
  transactionId: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Generic envelope the Payments and Orders endpoints wrap their data in. */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string | null;
}

// --- Order history (GET /orders/my-orders, GET /orders/:id) ---
// This is a DIFFERENT shape from the `Order` above (which is what
// POST /cart/checkout returns right after checkout). This one is the
// "read" view built by OrdersService.formatOrderResponse(): it uses
// `items` instead of `orderItems`, adds `orderNumber`, and has no
// `totalAmount`/`cartId`. Kept as separate types to avoid conflating
// the two responses.

export interface OrderHistoryItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  total: number;
  shippingAddress: string;
  items: OrderHistoryItem[];
  createdAt: string;
  updatedAt: string;
  userEmail?: string;
  userName?: string;
  trackingNumber?: string | null;
  notes?: string | null;
}

export interface PaginatedOrders {
  data: OrderSummary[];
  total: number;
  page: number;
  limit: number;
}

export interface OrdersQuery {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  search?: string;
}

// --- Admin: Order status management ---
// Matches UpdateOrderDto exactly (status/trackingNumber/notes are all
// optional and independently patchable).

export interface UpdateOrderPayload {
  status?: OrderStatus;
  trackingNumber?: string;
  notes?: string;
}

/**
 * The backend does NOT validate status transitions (UpdateOrderDto
 * accepts any OrderStatus at any time) — this map is a front-end-only
 * business rule so the admin can't accidentally skip steps (e.g. jump
 * straight from PENDING to SHIPPED without ever marking PROCESSING).
 *
 * CANCELED is only reachable from PENDING. Once an order reaches
 * PROCESSING, stock has already been decremented and payment has
 * already been captured — OrdersService.update() only flips the
 * `status` field, it does NOT restore stock or issue a Stripe refund.
 * Allowing CANCELED from PROCESSING here would let an admin silently
 * create a real data inconsistency (money charged + stock gone, but
 * the order says "canceled"). Don't re-add it without also building
 * a real refund/restock flow on the backend.
 *
 * DELIVERED and CANCELED are terminal states.
 */
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["PENDING", "PROCESSING", "CANCELED"],
  PROCESSING: ["PROCESSING", "SHIPPED"],
  SHIPPED: ["SHIPPED", "DELIVERED"],
  DELIVERED: ["DELIVERED"],
  CANCELED: ["CANCELED"],
};

// --- User profile ---
// GET/PATCH /users/profile return the User shape directly, no envelope.
// Deliberately excludes UpdateUserDto's `role` and `password` fields —
// changing your own role or password without re-entering it is bad
// practice even though the backend DTO technically allows it. Password
// changes go through ChangePasswordDto instead (requires current password).

export interface UpdateProfilePayload {
  name?: string;
  lastName?: string;
  email?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface MessageResponse {
  message: string;
}

// --- Admin: Products (create/update) ---
// Matches CreateProductDto / UpdateProductDto exactly. UpdateProductDto
// is CreateProductDto's PartialType, so every field is optional there.

export interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  stock: number;
  sku: string;
  imageUrl?: string;
  categoryId: string;
  isActive?: boolean;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

export interface UploadImageData {
  url: string;
  publicId: string;
}

// --- Admin: Categories ---
// ASSUMPTION: CreateCategoryDto/CategoryResponseDto weren't shared, so
// this is a reasonable guess based on the common `name`/`slug` pattern
// seen elsewhere (e.g. GET /categories/slug/:slug exists). Adjust here
// if the real DTO differs — this is the only place that needs to change.

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoriesMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategoriesResponse {
  data: Category[];
  meta: CategoriesMeta;
}

export interface CreateCategoryPayload {
  name: string;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

// --- Admin: Users ---
// PATCH /users/:id (admin only) reuses UpdateUserDto, which the backend
// lowercases as `role` (unlike the read model's `Role` capitalized field).

export type AdminUpdateUserPayload = Partial<{
  name: string;
  lastName: string;
  email: string;
  role: Role;
}>;
