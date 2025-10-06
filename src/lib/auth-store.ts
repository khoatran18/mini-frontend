'use client';

import { create } from 'zustand';
import { AuthAPI, Tokens, LoginInput, RegisterInput } from '@/lib/endpoints';
import { useCart } from './cart-store';

interface AuthState {
  isAuthenticated: boolean;
  role: string | null;
  userId: number | null;
  login: (credentials: LoginInput, role: string, onSuccess: () => void) => Promise<void>;
  register: (credentials: RegisterInput, onSuccess: () => void) => Promise<void>;
  logout: (onSuccess: () => void) => void;
  checkAuth: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: Tokens.getAccessToken() ? true : false,
  role: null,
  userId: null,
  login: async (credentials, role, onSuccess) => {
    const response = await AuthAPI.login(credentials);
    if (!response.success) {
      throw new Error(response.message || 'Login failed');
    }
    const { access_token, refresh_token, role, user_id } = response;
    Tokens.save(access_token, refresh_token);
    set({ isAuthenticated: true, role, userId: user_id });
    onSuccess();
  },
  register: async (credentials, onSuccess) => {
    await AuthAPI.register(credentials);
    onSuccess();
  },
  logout: () => {}, // TODO: implement logout logic
  checkAuth: () => {
    const role = Tokens.getRole();
    const userId = Tokens.getUserId();
    if (role && userId) {
      set({ isAuthenticated: true, role, userId });
    }
  },
}));
