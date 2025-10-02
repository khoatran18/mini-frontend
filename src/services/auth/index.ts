import api from '@/src/lib/api';

// Types (aligned with OpenAPI)
export type LoginInput = { username: string; password: string; role: string };
export type LoginOutput = { access_token: string; refresh_token: string; message?: string; success?: boolean };

export type RegisterInput = { username: string; password: string; role: string };
export type RegisterOutput = { message: string; success: boolean };

export type RegisterSellerRolesInput = { username: string; password: string; role: string; seller_admin_id: number };
export type RegisterSellerRolesOutput = { message: string; success: boolean };

export type RefreshTokenInput = { refresh_token: string };
export type RefreshTokenOutput = { access_token: string; refresh_token: string; message?: string; success?: boolean };

export type ChangePasswordInput = { username: string; old_password: string; new_password: string; role: string };
export type ChangePasswordOutput = { message: string; success: boolean };

// Service
export const AuthAPI = {
  login: (input: LoginInput) => api.post<LoginOutput>('/auth/login', input).then(r => r.data),
  register: (input: RegisterInput) => api.post<RegisterOutput>('/auth/register', input).then(r => r.data),
  registerSellerRoles: (input: RegisterSellerRolesInput) => api.post<RegisterSellerRolesOutput>('/auth/register-seller-roles', input).then(r => r.data),
  changePassword: (input: ChangePasswordInput) => api.post<ChangePasswordOutput>('/auth/change-password', input).then(r => r.data),
  refresh: (input: RefreshTokenInput) => api.post<RefreshTokenOutput>('/auth/refresh-token', input).then(r => r.data),
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
