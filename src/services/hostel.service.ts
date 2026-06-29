import api from '@/lib/api';
import type { ApiResponse, Hostel } from '@/types';

export interface HostelPayload {
  name: string;
  type: 'MALE' | 'FEMALE' | 'MIXED';
  description?: string;
  location?: string;
  imageUrl?: string;
  wardenId?: number | null;
}

export const hostelService = {
  async getAll(params?: { type?: string; isActive?: boolean }) {
    const res = await api.get<ApiResponse<Hostel[]>>('/hostels', { params });
    return res.data.data || [];
  },

  async getById(id: number) {
    const res = await api.get<ApiResponse<Hostel>>(`/hostels/${id}`);
    return res.data.data as Hostel;
  },

  async create(payload: HostelPayload) {
    const res = await api.post<ApiResponse<Hostel>>('/hostels', payload);
    return res.data.data as Hostel;
  },

  async update(id: number, payload: Partial<HostelPayload>) {
    const res = await api.patch<ApiResponse<Hostel>>(`/hostels/${id}`, payload);
    return res.data.data as Hostel;
  },

  async remove(id: number) {
    await api.delete(`/hostels/${id}`);
  },
};
