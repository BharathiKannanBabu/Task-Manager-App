import { create } from 'zustand';
import { INotification } from '../types/index.js';
import { notificationService } from '../services/notificationService.js';

interface NotificationState {
  notifications: INotification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotifications: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    try {
      set({ isLoading: true });
      const res = await notificationService.getNotifications();
      set({
        notifications: res.data,
        unreadCount: res.unreadCount,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      set({
        notifications: get().notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, get().unreadCount - 1),
      });
    } catch (err) {
      console.error(err);
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationService.markAllAsRead();
      set({
        notifications: get().notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      });
    } catch (err) {
      console.error(err);
    }
  },

  clearNotifications: async () => {
    try {
      await notificationService.clearNotifications();
      set({ notifications: [], unreadCount: 0 });
    } catch (err) {
      console.error(err);
    }
  },

  deleteNotification: async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      const target = get().notifications.find((n) => n._id === id);
      set({
        notifications: get().notifications.filter((n) => n._id !== id),
        unreadCount: target && !target.isRead ? Math.max(0, get().unreadCount - 1) : get().unreadCount,
      });
    } catch (err) {
      console.error(err);
    }
  },
}));
