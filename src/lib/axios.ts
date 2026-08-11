import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { APP_CONFIG } from '@/constants/config';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || APP_CONFIG.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      let token = localStorage.getItem(APP_CONFIG.AUTH_TOKEN_KEY);

      if (!token) {
        try {
          const persistedAuth = localStorage.getItem('rentnest_auth_store');
          if (persistedAuth) {
            const parsed = JSON.parse(persistedAuth);
            token = parsed?.state?.token || null;
          }
        } catch {
          token = null;
        }
      }

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(APP_CONFIG.AUTH_TOKEN_KEY);
        localStorage.removeItem('rentnest_auth_store');
      }
    }

    // Extract standard backend API error message if provided
    const serverMessage = error.response?.data?.message;
    if (serverMessage) {
      return Promise.reject(new Error(serverMessage));
    }

    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      return Promise.reject(
        new Error('Unable to connect to RentNest backend server. Please check your network connection and try again.')
      );
    }

    return Promise.reject(error);
  }
);

export default api;
