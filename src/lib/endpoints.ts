import api from './api';

// Types matching the provided OpenAPI (partial where convenient)
export type LoginInput = { username: string; password: string; role: string };
export type LoginOutput = { access_token: string; refresh_token: string; message?: string; success?: boolean };

export type RegisterInput = { username: string; password: string; role: string };
export type RegisterOutput = { message: string; success: boolean };

export type RefreshTokenInput = { refresh_token: string };
export type RefreshTokenOutput = { access_token: string; refresh_token: string; message?: string; success?: boolean };

export type ChangePasswordInput = { username: string; old_password: string; new_password: string; role: string };
export type ChangePasswordOutput = { message: string; success: boolean };

export type Product = { id?: number; name: string; price: number; inventory: number; seller_id?: number; attributes?: Record<string, any> };
export type GetProductsOutput = { message?: string; success?: boolean; products: Product[] };
export type GetProductByIDOutput = { message?: string; success?: boolean; product: Product };
export type CreateProductInput = { name: string; price: number; inventory: number; seller_id: number; attributes?: Record<string, any> };
export type CreateProductOutput = { message: string; success: boolean };
export type UpdateProductInput = { product: Product; user_id?: number };
export type UpdateProductOutput = { message: string; success: boolean };

export type OrderItem = { id?: number; product_id: number; name?: string; price?: number; quantity: number; order_id?: number };
export type Order = { id?: number; buyer_id: number; status?: string; total_price?: number; order_items: OrderItem[] };
export type CreateOrderInput = { order: Order };
export type CreateOrderOutput = { message: string; success: boolean };
export type GetOrderByIDOutput = { message?: string; success?: boolean; order: Order };
export type GetOrdersByBuyerIDStatusOutput = { message?: string; success?: boolean; orders: Order[] };
export type UpdateOrderByIDInput = { order: Order };
export type UpdateOrderByIDOutput = { message: string; success: boolean };
export type CancelOrderByIDOutput = { message: string; success: boolean };

export type Buyer = { user_id?: number; name?: string; phone?: string; address?: string; date_of_birth?: string; gender?: string };
export type CreateBuyerInput = { buyer: Buyer };
export type CreateBuyerOutput = { message: string; success: boolean };
export type UpdBuyByUseIDInput = { buyer: Buyer };
export type UpdBuyByUseIDOutput = { message: string; success: boolean };
export type GetBuyByUseIDOutput = { message?: string; success?: boolean; buyer?: Buyer };
export type DelBuyByUseIDOutput = { message: string; success: boolean };

export type Seller = { id?: number; name?: string; phone?: string; address?: string; date_of_birth?: string; description?: string; bank_account?: string; tax_code?: string };
export type CreateSellerInput = { seller: Seller; user_id: number };
export type CreateSellerOutput = { message: string; success: boolean };
export type UpdSelByIDInput = { seller: Seller; user_id: number };
export type UpdSelByIDOutput = { message: string; success: boolean };
export type GetSelByIDOutput = { message?: string; success?: boolean; seller?: Seller };
export type DelSelByIDOutput = { message: string; success: boolean };
export type GetProductsBySellerIDOutput = { message?: string; success?: boolean; products: Product[] };

// Auth
export const AuthAPI = {
  login: (input: LoginInput) => api.post<LoginOutput>('/auth/login', input).then(r => r.data),
  register: (input: RegisterInput) => api.post<RegisterOutput>('/auth/register', input).then(r => r.data),
  changePassword: (input: ChangePasswordInput) => api.post<ChangePasswordOutput>('/auth/change-password', input).then(r => r.data),
  refresh: (input: RefreshTokenInput) => api.post<RefreshTokenOutput>('/auth/refresh-token', input).then(r => r.data),
};

// Products
export const ProductAPI = {
  list: (page: number, page_size: number) => api.get<GetProductsOutput>('/products', { params: { page, page_size } }).then(r => r.data),
  getById: (id: number) => api.get<GetProductByIDOutput>(`/products/${id}`).then(r => r.data),
  create: (input: CreateProductInput) => api.post<CreateProductOutput>('/products', input).then(r => r.data),
  update: (id: number, input: UpdateProductInput) => api.put<UpdateProductOutput>(`/products/${id}`, input).then(r => r.data),
  bySeller: (seller_id: number) => api.get<GetProductsBySellerIDOutput>(`/products/seller/${seller_id}`).then(r => r.data),
};

// Orders
export const OrderAPI = {
  listByBuyerAndStatus: (buyer_id: number, status: string) => api.get<GetOrdersByBuyerIDStatusOutput>('/orders', { params: { buyer_id, status } }).then(r => r.data),
  create: (input: CreateOrderInput) => api.post<CreateOrderOutput>('/orders', input).then(r => r.data),
  getById: (id: number) => api.get<GetOrderByIDOutput>(`/orders/${id}`).then(r => r.data),
  update: (id: number, input: UpdateOrderByIDInput) => api.put<UpdateOrderByIDOutput>(`/orders/${id}`, input).then(r => r.data),
  cancel: (id: number) => api.delete<CancelOrderByIDOutput>(`/orders/${id}`).then(r => r.data),
};

// Users - Buyers
export const BuyerAPI = {
  create: (input: CreateBuyerInput) => api.post<CreateBuyerOutput>('/users/buyers', input).then(r => r.data),
  getByUserId: (user_id: number) => api.get<GetBuyByUseIDOutput>(`/users/buyers/${user_id}`).then(r => r.data),
  updateByUserId: (user_id: number, input: UpdBuyByUseIDInput) => api.put<UpdBuyByUseIDOutput>(`/users/buyers/${user_id}`, input).then(r => r.data),
  deleteByUserId: (user_id: number) => api.delete<DelBuyByUseIDOutput>(`/users/buyers/${user_id}`).then(r => r.data),
};

// Users - Sellers
export const SellerAPI = {
  create: (input: CreateSellerInput) => api.post<CreateSellerOutput>('/users/sellers', input).then(r => r.data),
  getById: (id: number) => api.get<GetSelByIDOutput>(`/users/sellers/${id}`).then(r => r.data),
  updateById: (id: number, input: UpdSelByIDInput) => api.put<UpdSelByIDOutput>(`/users/sellers/${id}`, input).then(r => r.data),
  deleteById: (id: number) => api.delete<DelSelByIDOutput>(`/users/sellers/${id}`).then(r => r.data),
};

// Token utilities for client usage
export const Tokens = {
  save: (access: string, refresh: string, role?: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    if (role) localStorage.setItem('user_role', role);
  },
  clear: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
  },
  getRole: () => (typeof window !== 'undefined' ? localStorage.getItem('user_role') : null),
};
