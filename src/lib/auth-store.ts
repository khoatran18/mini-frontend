'use client';

import { create } from 'zustand';
/**
 * NOTE: The Tokens object seems to have an incorrect type definition or is missing the getAccessToken function.
 * Replace Tokens.getAccessToken() with the actual function used in your project to retrieve the access token.
 * This could be a function from a separate storage utility or a method on the Tokens object if it's structured differently.
 * For now, using a placeholder function to avoid type errors.
 */
// TODO: Replace with actual function to get access token from storage
const getAccessTokenFromStorage = () => null; // Placeholder, replace with actual logic
import { AuthAPI, Tokens, LoginInput, RegisterInput } from '@/lib/endpoints';
import { useCart } from './cart-store';

interface AuthState {
  isAuthenticated: boolean;
  role: string | null;
  userId: number | null;
  login: (username: string, password: string, role: string, onSuccess?: () => void) => Promise<void>;
  register: (credentials: RegisterInput, onSuccess: () => void) => Promise<void>;
  logout: (onSuccess: () => void) => void;
  checkAuth: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: getAccessTokenFromStorage() !== null,
  role: null,
  userId: null, // TODO: The user ID is not returned by the login API. Need to figure out how to get it.
  login: async (username, password, role, onSuccess) => {
    const response = await AuthAPI.login({ username, password, role });
    if (!response.success) {
      throw new Error(response.message || 'Login failed');
    }
    Tokens.save(response.access_token, response.refresh_token, role);
    // Assuming role is selected by the user and passed in, not from API response
    set({ isAuthenticated: true, role });
    if (onSuccess && typeof onSuccess === 'function') {
      onSuccess();
    }
  },
  register: async (credentials, onSuccess) => {
    const response = await AuthAPI.register(credentials);
    if (response.success) onSuccess();
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
