import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = Cookies.get('hms_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralize 401 handling: clear session and redirect to login.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      Cookies.remove('hms_token');
      Cookies.remove('hms_user');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Extracts a human-readable message from an API error response,
 * falling back to a generic message if the shape is unexpected.
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; errors?: { message: string }[] } | undefined;
    if (data?.errors && data.errors.length > 0) {
      return data.errors.map((e) => e.message).join(', ');
    }
    if (data?.message) return data.message;
    if (error.message === 'Network Error') {
      return 'Unable to reach the server. Please check your connection and try again.';
    }
  }
  return 'Something went wrong. Please try again.';
}

export default api;
