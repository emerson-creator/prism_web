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

export type OrderStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELED";

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

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | string;

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

/** Generic envelope the Payments endpoints wrap their data in. */
export interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}
