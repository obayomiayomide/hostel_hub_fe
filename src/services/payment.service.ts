import api from '@/lib/api';
import type { ApiResponse, Payment } from '@/types';

export const paymentService = {
  async initiate(applicationId: number, amount: number) {
    const res = await api.post<ApiResponse<{ payment: Payment; reference: string; checkoutUrl: string }>>(
      '/payments/initiate',
      { applicationId, amount }
    );
    return res.data.data!;
  },

  async verify(reference: string) {
    const res = await api.post<ApiResponse<{ payment: Payment; alreadyProcessed: boolean }>>(
      '/payments/verify',
      { reference }
    );
    return res.data.data!;
  },

  async getMine() {
    const res = await api.get<ApiResponse<Payment[]>>('/payments/me');
    return res.data.data || [];
  },

  async getAll(params?: { status?: string; page?: number; limit?: number }) {
    const res = await api.get<ApiResponse<Payment[]>>('/payments', { params });
    return { data: res.data.data || [], meta: res.data.meta };
  },

  async getByReference(reference: string) {
    const res = await api.get<ApiResponse<Payment>>(`/payments/${reference}`);
    return res.data.data as Payment;
  },
};
