import api from '@/lib/api';
import type { ApiResponse, Room } from '@/types';

export interface RoomPayload {
  hostelId: number;
  roomNumber: string;
  floor?: string;
  capacity: number;
  pricePerSession: number;
}

export const roomService = {
  async getAll(params?: { hostelId?: number; status?: string }) {
    const res = await api.get<ApiResponse<Room[]>>('/rooms', { params });
    return res.data.data || [];
  },

  async getById(id: number) {
    const res = await api.get<ApiResponse<Room>>(`/rooms/${id}`);
    return res.data.data as Room;
  },

  async create(payload: RoomPayload) {
    const res = await api.post<ApiResponse<Room>>('/rooms', payload);
    return res.data.data as Room;
  },

  async update(id: number, payload: Partial<RoomPayload> & { status?: string }) {
    const res = await api.patch<ApiResponse<Room>>(`/rooms/${id}`, payload);
    return res.data.data as Room;
  },

  async remove(id: number) {
    await api.delete(`/rooms/${id}`);
  },
};
