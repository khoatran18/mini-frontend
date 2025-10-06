
'use client';

import { create } from 'zustand';
import { AuthAPI, Tokens, LoginInput, RegisterInput } from '@/lib/endpoints';
import { useCart } from './cart-store';

// TODO: Replace with actual function to get access token from storage
const getAccessTokenFromStorage = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
}

interface AuthState {
  isAuthenticated: boolean;
  role: string | null;
  login: (username: string, password: string, role: string, onSuccess?: () => void) => Promise<void>;
  register: (credentials: RegisterInput, onSuccess: () => void) => Promise<void>;
  logout: (onSuccess: () => void) => void;
  checkAuth: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: getAccessTokenFromStorage() !== null,
  role: null,
  login: async (username, password, role, onSuccess) => {
    const response = await AuthAPI.login({ username, password, role });
    if (!response.success) {
      throw new Error(response.message || 'Login failed');
    }
    Tokens.save(response.access_token, response.refresh_token, role);
    set({ isAuthenticated: true, role });
    if (onSuccess && typeof onSuccess === 'function') {
      onSuccess();
    }
  },
  register: async (credentials, onSuccess) => {
    const response = await AuthAPI.register(credentials);
    if (response.success) onSuccess();
  },
  logout: (onSuccess) => {
    Tokens.clear();
    useCart.getState().clearCart();
    set({ isAuthenticated: false, role: null });
    if (onSuccess) onSuccess();
  },
  checkAuth: () => {
    const role = Tokens.getRole();
    if (role) {
      set({ isAuthenticated: true, role });
    }
  },
}));
