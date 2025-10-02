'use client';

import { create } from 'zustand';
import { AuthAPI, Tokens } from '@/lib/endpoints';
import { LoginInput } from '@/lib/endpoints';
import { useCart } from './cart-store';

interface AuthState {
  isAuthenticated: boolean;
  role: string | null;
  userId: number | null;
  login: (credentials: LoginInput, onSuccess: () => void) => Promise<void>;
  logout: (onSuccess: () => void) => void;
  checkAuth: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  role: null,
  userId: null,
  login: async (credentials, onSuccess) => {
    const { access_token, refresh_token, role, user_id } = await AuthAPI.login(credentials);
    Tokens.save(access_token, refresh_token, role, user_id);
    set({ isAuthenticated: true, role, userId: user_id });
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
