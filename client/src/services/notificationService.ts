import api from './api.js';
import { INotification } from '../types/index.js';

export const notificationService = {
  async getNotifications(): Promise<{ success: boolean; data: INotification[]; unreadCount: number }> {
    const res = await api.get<{ success: boolean; data: INotification[]; unreadCount: number }>('/notifications');
    return res.data;
  },

  async markAsRead(id: string): Promise<{ success: boolean; data: INotification }> {
    const res = await api.patch<{ success: boolean; data: INotification }>(`/notifications/${id}/read`);
    return res.data;
  },

  async markAllAsRead(): Promise<{ success: boolean; message: string }> {
    const res = await api.patch<{ success: boolean; message: string }>('/notifications/read-all');
    return res.data;
  },

  async clearNotifications(): Promise<{ success: boolean; message: string }> {
    const res = await api.delete<{ success: boolean; message: string }>('/notifications/clear');
    return res.data;
  },

  async deleteNotification(id: string): Promise<{ success: boolean; message: string }> {
    const res = await api.delete<{ success: boolean; message: string }>(`/notifications/${id}`);
    return res.data;
  },
};
