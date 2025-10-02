import api from './api';

// General-purpose types
export type ApiMessage = { message: string; success: boolean };

// Auth
export type LoginInput = { username: string; password: string; role: string };
export type LoginOutput = { access_token: string; refresh_token: string } & ApiMessage;

export type RegisterInput = { username: string; password: string; role: string };
export type RegisterOutput = ApiMessage;

export type RefreshTokenInput = { refresh_token: string };
export type RefreshTokenOutput = { access_token: string; refresh_token: string } & ApiMessage;

export type ChangePasswordInput = { username: string; old_password: string; new_password: string; role: string };
export type ChangePasswordOutput = ApiMessage;

// Products
export type Product = { id: number; name: string; price: number; inventory: number; seller_id: number; attributes?: Record<string, any> };
export type ProductInput = Omit<Product, 'id'>;
export type GetProductsOutput = { products: Product[] } & ApiMessage;
export type GetProductOutput = { product: Product } & ApiMessage;
export type ProductCRUDOutput = ApiMessage;

// Orders
export type OrderItem = { id: number; product_id: number; productName?: string; quantity: number; price: number; order_id: number };
export type Order = { id: number; buyer_id: number; status: string; total_price: number; items: OrderItem[] };
export type OrderInput = { buyer_id: number; order_items: Omit<OrderItem, 'id' | 'order_id' | 'price'>[] };
export type GetOrdersOutput = { orders: Order[] } & ApiMessage;
export type GetOrderOutput = { order: Order } & ApiMessage;
export type OrderCRUDOutput = ApiMessage;

// Users - Buyer
export type Buyer = { user_id: number; name: string; phone: string; address: string; date_of_birth: string; gender: string };
export type BuyerInput = Omit<Buyer, 'user_id'>;
export type GetBuyerOutput = { buyer: Buyer } & ApiMessage;
export type BuyerCRUDOutput = ApiMessage;

// Users - Seller
export type Seller = { id: number; name: string; phone: string; address: string; description: string; bank_account: string; tax_code: string };
export type SellerInput = Omit<Seller, 'id'>;
export type GetSellerOutput = { seller: Seller } & ApiMessage;
export type SellerCRUDOutput = ApiMessage;

// API Endpoints

export const AuthAPI = {
  login: (input: LoginInput) => api.post<LoginOutput>('/auth/login', input).then(r => r.data),
  register: (input: RegisterInput) => api.post<RegisterOutput>('/auth/register', input).then(r => r.data),
  changePassword: (input: ChangePasswordInput) => api.post<ChangePasswordOutput>('/auth/change-password', input).then(r => r.data),
  refresh: (input: RefreshTokenInput) => api.post<RefreshTokenOutput>('/auth/refresh-token', input).then(r => r.data),
};

export const ProductAPI = {
  getAll: () => api.get<GetProductsOutput>('/products').then(r => r.data),
  get: (id: number) => api.get<GetProductOutput>(`/products/${id}`).then(r => r.data.product),
  create: (input: ProductInput) => api.post<ProductCRUDOutput>('/products', input).then(r => r.data),
  update: (id: number, input: Partial<ProductInput>) => api.put<ProductCRUDOutput>(`/products/${id}`, input).then(r => r.data),
  delete: (id: number) => api.delete<ProductCRUDOutput>(`/products/${id}`).then(r => r.data),
  getProductsBySeller: (sellerId: number) => api.get<GetProductsOutput>(`/products/seller/${sellerId}`).then(r => r.data.products),
};

export const OrderAPI = {
  create: (input: OrderInput) => api.post<OrderCRUDOutput>('/orders', input).then(r => r.data),
  get: (id: number) => api.get<GetOrderOutput>(`/orders/${id}`).then(r => r.data.order),
  getOrdersByBuyer: (buyerId: number) => api.get<GetOrdersOutput>(`/orders?buyer_id=${buyerId}`).then(r => r.data.orders),
  cancel: (id: number) => api.delete<OrderCRUDOutput>(`/orders/${id}`).then(r => r.data),
};

const BuyerAPI = {
  get: (userId: number) => api.get<GetBuyerOutput>(`/users/buyers/${userId}`).then(r => r.data),
  update: (userId: number, input: BuyerInput) => api.put<BuyerCRUDOutput>(`/users/buyers/${userId}`, input).then(r => r.data),
};

const SellerAPI = {
  get: (sellerId: number) => api.get<GetSellerOutput>(`/users/sellers/${sellerId}`).then(r => r.data),
  update: (sellerId: number, input: SellerInput) => api.put<SellerCRUDOutput>(`/users/sellers/${sellerId}`, input).then(r => r.data),
};

export const UserAPI = {
  getProfile: (id: number, role: string) => {
    if (role === 'buyer') {
      return BuyerAPI.get(id).then(data => data.buyer);
    } else if (role.startsWith('seller')) {
      // We are assuming the user ID is the same as the seller ID for fetching profiles.
      return SellerAPI.get(id).then(data => data.seller);
    }
    return Promise.reject(new Error('Invalid role for fetching profile'));
  },
  updateProfile: (id: number, role: string, data: any) => {
    if (role === 'buyer') {
      return BuyerAPI.update(id, data as BuyerInput);
    } else if (role.startsWith('seller')) {
      return SellerAPI.update(id, data as SellerInput);
    }
    return Promise.reject(new Error('Invalid role for updating profile'));
  },
};

// Token utilities
export const Tokens = {
  save: (access: string, refresh: string, role?: string, userId?: number) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    if (role) localStorage.setItem('user_role', role);
    if (userId) localStorage.setItem('user_id', String(userId));
  },
  clear: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
  },
  getRole: () => (typeof window !== 'undefined' ? localStorage.getItem('user_role') : null),
  getUserId: () => (typeof window !== 'undefined' ? Number(localStorage.getItem('user_id')) : null),
};
