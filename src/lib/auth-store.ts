'use client';

import { create } from 'zustand';
import { AuthAPI, Tokens, LoginInput, RegisterInput } from '@/lib/endpoints';
import { useCart } from './cart-store';

interface AuthState {
  isAuthenticated: boolean;
  role: string | null;
  userId: number | null;
  login: (credentials: LoginInput, onSuccess: () => void) => Promise<void>;
  register: (credentials: RegisterInput, onSuccess: () => void) => Promise<void>;
  logout: (onSuccess: () => void) => void;
  checkAuth: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  role: null,
  userId: null,
  login: async (credentials, onSuccess) => {
    const response = await AuthAPI.login(credentials);
    if (!response.success) {
      throw new Error(response.message || 'Login failed');
    }
    const { access_token, refresh_token, role, user_id } = response;
    Tokens.save(access_token, refresh_token, role, user_id);
    set({ isAuthenticated: true, role, userId: user_id });
    onSuccess();
  },
  register: async (credentials, onSuccess) => {
    const response = await AuthAPI.register(credentials);
    if (!response.success) {
      throw new Error(response.message || 'Registration failed');
    }
    onSuccess();
  },
  logout: (onSuccess) => {
    Tokens.clear();
    useCart.getState().clearCart();
    set({ isAuthenticated: false, role: null, userId: null });
    onSuccess();
  },
  checkAuth: () => {
    const role = Tokens.getRole();
    const userId = Tokens.getUserId();
    if (role && userId) {
      set({ isAuthenticated: true, role, userId });
    }
  },
}));
