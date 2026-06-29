import api from '@/lib/api';
import type { ApiResponse, MaintenanceRequest } from '@/types';

export interface MaintenancePayload {
  roomId?: number;
  category: string;
  priority?: string;
  description: string;
  photoUrl?: string;
}

export const maintenanceService = {
  async create(payload: MaintenancePayload) {
    const res = await api.post<ApiResponse<MaintenanceRequest>>('/maintenance', payload);
    return res.data.data as MaintenanceRequest;
  },

  async getMine() {
    const res = await api.get<ApiResponse<MaintenanceRequest[]>>('/maintenance/me');
    return res.data.data || [];
  },

  async getAll(params?: { status?: string; category?: string; priority?: string }) {
    const res = await api.get<ApiResponse<MaintenanceRequest[]>>('/maintenance', { params });
    return res.data.data || [];
  },

  async getById(id: number) {
    const res = await api.get<ApiResponse<MaintenanceRequest>>(`/maintenance/${id}`);
    return res.data.data as MaintenanceRequest;
  },

  async update(id: number, payload: { status?: string; priority?: string; handledById?: number }) {
    const res = await api.patch<ApiResponse<MaintenanceRequest>>(`/maintenance/${id}`, payload);
    return res.data.data as MaintenanceRequest;
  },
};
