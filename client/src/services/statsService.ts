import api from './api.js';
import { IDashboardStats } from '../types/index.js';

export const statsService = {
  async getDashboardStats(): Promise<{ success: boolean; data: IDashboardStats }> {
    const res = await api.get<{ success: boolean; data: IDashboardStats }>('/stats/dashboard');
    return res.data;
  },
};
