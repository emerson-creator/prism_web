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
// Shape preliminar; ajustar en cuanto confirmes GET /cart real.
export interface CartItem {
  id: string; // id del item dentro del carrito (para PATCH/DELETE /cart/items/{itemId})
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
}

export interface AddCartItemPayload {
  productId: string;
  quantity: number;
}
