'use client';

import { create } from 'zustand';
import { AuthAPI, Tokens } from '../endpoints';
import { LoginInput } from '../endpoints';
import { useCart } from './cart-store';

interface AuthState {
  isAuthenticated: boolean;
  role: string | null;
  login: (credentials: LoginInput, onSuccess: () => void) => Promise<void>;
  logout: (onSuccess: () => void) => void;
  checkAuth: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  role: null,
  login: async (credentials, onSuccess) => {
    const { access_token, refresh_token } = await AuthAPI.login(credentials);
    Tokens.save(access_token, refresh_token, credentials.role);
    set({ isAuthenticated: true, role: credentials.role });
    onSuccess();
  },
  logout: (onSuccess) => {
    Tokens.clear();
    useCart.getState().clearCart();
    set({ isAuthenticated: false, role: null });
    onSuccess();
  },
  checkAuth: () => {
    const role = Tokens.getRole();
    if (role) {
      set({ isAuthenticated: true, role });
    }
  },
}));
