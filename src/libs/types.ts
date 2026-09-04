// Tipos derivados de la respuesta real de la API (Swagger)

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product extends BaseEntity {
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  imageUrl: string | null;
  isActive: boolean;
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

export type Role = "ADMIN" | "USER" | "CUSTOMER"; // ajustar si hay más roles

export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  Role: Role;
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

export interface RegisterPayload extends LoginPayload {
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

export interface Cart extends BaseEntity {
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

export interface OrderItem extends BaseEntity {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order extends BaseEntity {
  orderNumber: string;
  userId: string;
  status: string;
  total: number;
  shippingAddress: string;
  items: OrderItem[];
  userEmail?: string;
  userName?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export type OrderApiResponse<T> = ApiResponse<T>;
export type PaginatedOrderResponse = PaginatedResponse<Order>;

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

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | string;

export interface Payment extends BaseEntity {
  orderId: string;
  amount: number;
  userId: string;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string | null;
  transactionId: string | null;
}

/** Generic envelope the Payments endpoints wrap their data in. */
export type ApiEnvelope<T> = ApiResponse<T>;
