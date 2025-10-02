import axios, { AxiosError, AxiosRequestConfig } from 'axios';

// Prefer environment variable; if not set, fall back to relative URLs (no baseURL)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || undefined;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const isBrowser = typeof window !== 'undefined';
const getAccessToken = (): string | null => (isBrowser ? localStorage.getItem('access_token') : null);
const getRefreshToken = (): string | null => (isBrowser ? localStorage.getItem('refresh_token') : null);

// Concurrency control for refresh requests
let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

const resolveQueue = (token: string | null) => {
  pendingQueue.forEach((cb) => {
    try { cb(token); } catch {}
  });
  pendingQueue = [];
};

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (!originalRequest || status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Don't attempt to refresh if we're already calling the refresh endpoint
    if ((originalRequest.url || '').includes('/auth/refresh-token')) {
      return Promise.reject(error);
    }

    // SSR guard: don't touch localStorage or redirect on the server
    if (!isBrowser) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push((token) => {
          if (!token) return reject(error);
          originalRequest.headers = originalRequest.headers ?? {};
          (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token');

      // Use same base as api: absolute if NEXT_PUBLIC_API_BASE_URL is set, else relative
      const base = API_BASE_URL ? API_BASE_URL.replace(/\/$/, '') : '';
      const url = `${base}/auth/refresh-token`;

      const resp = await axios.post(url, { refresh_token: refreshToken });
      const { access_token, refresh_token } = (resp.data || {}) as {
        access_token?: string;
        refresh_token?: string;
      };

      if (!access_token || !refresh_token) {
        throw new Error('Invalid refresh response');
      }

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      resolveQueue(access_token);

      originalRequest.headers = originalRequest.headers ?? {};
      (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${access_token}`;
      return api(originalRequest);
    } catch (refreshErr) {
      // Clear tokens and redirect to login
      try {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
      } catch {}
      resolveQueue(null);
      try {
        window.location.href = '/auth/login';
      } catch {}
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
