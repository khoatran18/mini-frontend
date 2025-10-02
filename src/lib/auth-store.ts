'use client';

import { create } from 'zustand';
import jwt from 'jwt-decode';
import { AuthAPI, Tokens } from '../endpoints';
import { LoginInput } from '../endpoints';
import { useCart } from './cart-store';

interface DecodedToken {
    exp: number;
    iat: number;
    role: string;
    user_id: number;
    username: string;
}

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
    const { access_token, refresh_token } = await AuthAPI.login(credentials);
    const decodedToken: DecodedToken = jwt(access_token);
    const { user_id, role } = decodedToken;
    
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
