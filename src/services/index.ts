import api from '@/lib/api';
import type { ApiResponse, AdminStats, HostelOccupancy, StudentStats, AcademicSession, User, Notification } from '@/types';

export const dashboardService = {
  async getAdminStats() {
    const res = await api.get<ApiResponse<AdminStats>>('/dashboard/admin');
    return res.data.data as AdminStats;
  },
  async getOccupancy() {
    const res = await api.get<ApiResponse<HostelOccupancy[]>>('/dashboard/occupancy');
    return res.data.data || [];
  },
  async getStudentStats() {
    const res = await api.get<ApiResponse<StudentStats>>('/dashboard/student');
    return res.data.data as StudentStats;
  },
};

export const sessionService = {
  async getAll() {
    const res = await api.get<ApiResponse<AcademicSession[]>>('/sessions');
    return res.data.data || [];
  },
  async getActive() {
    const res = await api.get<ApiResponse<AcademicSession>>('/sessions/active');
    return res.data.data as AcademicSession | null;
  },
  async create(name: string, startDate?: string, endDate?: string) {
    const res = await api.post<ApiResponse<AcademicSession>>('/sessions', { name, startDate, endDate });
    return res.data.data as AcademicSession;
  },
  async activate(id: number) {
    await api.patch(`/sessions/${id}/activate`);
  },
};

export const userService = {
  async getAll(params?: { role?: string; search?: string; page?: number; limit?: number }) {
    const res = await api.get<ApiResponse<User[]>>('/users', { params });
    return { data: res.data.data || [], meta: res.data.meta };
  },
  async getById(id: number) {
    const res = await api.get<ApiResponse<User>>(`/users/${id}`);
    return res.data.data as User;
  },
  async create(payload: Partial<User> & { password?: string }) {
    const res = await api.post<ApiResponse<User>>('/users', payload);
    return res.data.data as User;
  },
  async update(id: number, payload: Partial<User> & { password?: string }) {
    const res = await api.patch<ApiResponse<User>>(`/users/${id}`, payload);
    return res.data.data as User;
  },
  async remove(id: number) {
    await api.delete(`/users/${id}`);
  },
  async toggleStatus(id: number) {
    const res = await api.patch<ApiResponse<User>>(`/users/${id}/toggle-status`);
    return res.data.data as User;
  },
};

export const notificationService = {
  async getAll() {
    const res = await api.get<ApiResponse<Notification[]>>('/notifications');
    return { data: res.data.data || [], unreadCount: res.data.meta?.unreadCount || 0 };
  },
  async markAsRead(id: number) {
    await api.patch(`/notifications/${id}/read`);
  },
  async markAllAsRead() {
    await api.patch('/notifications/read-all');
  },
};
