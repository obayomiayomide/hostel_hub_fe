import api from '@/lib/api';
import type { ApiResponse, Allocation } from '@/types';

export const allocationService = {
  async getMine() {
    const res = await api.get<ApiResponse<Allocation>>('/allocations/me');
    return res.data.data as Allocation | null;
  },

  async getAll(params?: { status?: string; sessionId?: number; hostelId?: number }) {
    const res = await api.get<ApiResponse<Allocation[]>>('/allocations', { params });
    return res.data.data || [];
  },

  async autoAllocate(applicationId: number) {
    const res = await api.post<ApiResponse<Allocation>>(`/allocations/auto/${applicationId}`);
    return res.data.data as Allocation;
  },

  async manualAllocate(applicationId: number, bedId: number) {
    const res = await api.post<ApiResponse<Allocation>>('/allocations/manual', {
      applicationId,
      bedId,
    });
    return res.data.data as Allocation;
  },

  async vacate(allocationId: number) {
    const res = await api.patch<ApiResponse<Allocation>>(`/allocations/${allocationId}/vacate`);
    return res.data.data as Allocation;
  },
};
