'use client';

import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { Tokens } from './endpoints';

const isBrowser = typeof window !== 'undefined';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

const getAccessToken = () => localStorage.getItem('access_token');
const getRefreshToken = () => localStorage.getItem('refresh_token');

let isRefreshing = false;
type PendingQueueItem = (token: string | null) => void;
let pendingQueue: PendingQueueItem[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  pendingQueue.forEach((prom) => prom(token));
  pendingQueue = [];
  isRefreshing = false;
};

if (isBrowser) {
  api.interceptors.request.use((config) => {
    console.log(`Making request to: ${config.baseURL}${config.url}`);
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => {
      console.log('Response received:', response.data);
      return response;
    },
    async (error: AxiosError) => {
      console.error('API Error:', error.response?.data);
      const status = error.response?.status;
      const originalRequest = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;

      if (!originalRequest || status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      if ((originalRequest.url || '').includes('/auth/refresh-token')) {
        return Promise.reject(error);
      }

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

        Tokens.save(access_token, refresh_token);

        originalRequest.headers = originalRequest.headers ?? {};
        (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${access_token}`;

        processQueue(null, access_token);
        return api(originalRequest);
      } catch (err) {
        processQueue(err as Error);
        return Promise.reject(err);
      }
    }
  );
}

export default api;
