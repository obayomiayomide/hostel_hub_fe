import api from '@/lib/api';
import type { ApiResponse, User } from '@/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  gender: 'MALE' | 'FEMALE';
  matricNumber?: string;
  department?: string;
  level?: string;
}

export interface AuthResult {
  user: User;
  token: string;
}

export const authService = {
  async login(payload: LoginPayload) {
    const res = await api.post<ApiResponse<AuthResult>>('/auth/login', payload);
    return res.data.data as AuthResult;
  },

  async register(payload: RegisterPayload) {
    const res = await api.post<ApiResponse<AuthResult>>('/auth/register', payload);
    return res.data.data as AuthResult;
  },

  async getMe() {
    const res = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return res.data.data?.user as User;
  },

  async updateProfile(payload: Partial<User>) {
    const res = await api.patch<ApiResponse<{ user: User }>>('/auth/profile', payload);
    return res.data.data?.user as User;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const res = await api.patch<ApiResponse<null>>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return res.data;
  },
};
