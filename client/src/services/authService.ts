import api from './api.js';
import { IUser } from '../types/index.js';

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: IUser;
}

export const authService = {
  async register(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/register', data);
    return res.data;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  async demoLogin(): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/demo');
    return res.data;
  },

  async getMe(): Promise<{ success: boolean; user: IUser }> {
    const res = await api.get<{ success: boolean; user: IUser }>('/auth/me');
    return res.data;
  },

  async updateProfile(data: Partial<IUser>): Promise<{ success: boolean; user: IUser }> {
    const res = await api.patch<{ success: boolean; user: IUser }>('/auth/profile', data);
    return res.data;
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
    const res = await api.post<{ success: boolean; message: string }>('/auth/change-password', data);
    return res.data;
  },
};
