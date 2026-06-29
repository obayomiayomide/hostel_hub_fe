import api from '@/lib/api';
import type { ApiResponse, Application } from '@/types';

export interface ApplicationPayload {
  hostelId: number;
  sessionId: number;
  preferredRoomType?: string;
}

export const applicationService = {
  async create(payload: ApplicationPayload) {
    const res = await api.post<ApiResponse<Application>>('/applications', payload);
    return res.data.data as Application;
  },

  async getMine() {
    const res = await api.get<ApiResponse<Application[]>>('/applications/me');
    return res.data.data || [];
  },

  async getAll(params?: { status?: string; hostelId?: number; sessionId?: number; page?: number; limit?: number }) {
    const res = await api.get<ApiResponse<Application[]>>('/applications', { params });
    return { data: res.data.data || [], meta: res.data.meta };
  },

  async getById(id: number) {
    const res = await api.get<ApiResponse<Application>>(`/applications/${id}`);
    return res.data.data as Application;
  },

  async updateStatus(id: number, status: string, remarks?: string) {
    const res = await api.patch<ApiResponse<Application>>(`/applications/${id}/status`, {
      status,
      remarks,
    });
    return res.data.data as Application;
  },

  async cancel(id: number) {
    const res = await api.patch<ApiResponse<Application>>(`/applications/${id}/cancel`);
    return res.data.data as Application;
  },
};
