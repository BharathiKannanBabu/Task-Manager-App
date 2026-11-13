import { create } from 'zustand';
import { IUser } from '../types/index.js';
import { authService } from '../services/authService.js';

interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<IUser>) => Promise<void>;
  changePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('liquid_task_token'),
  isAuthenticated: Boolean(localStorage.getItem('liquid_task_token')),
  isLoading: true,
  error: null,

  initAuth: async () => {
    const token = localStorage.getItem('liquid_task_token');
    if (!token) {
      set({ isLoading: false, isAuthenticated: false, user: null });
      return;
    }

    try {
      const res = await authService.getMe();
      set({ user: res.user, isAuthenticated: true, isLoading: false, error: null });
    } catch {
      localStorage.removeItem('liquid_task_token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.login(credentials);
      localStorage.setItem('liquid_task_token', res.token);
      set({ user: res.user, token: res.token, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Login failed' });
      throw err;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.register(data);
      localStorage.setItem('liquid_task_token', res.token);
      set({ user: res.user, token: res.token, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Registration failed' });
      throw err;
    }
  },

  demoLogin: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.demoLogin();
      localStorage.setItem('liquid_task_token', res.token);
      set({ user: res.user, token: res.token, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Demo login failed' });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('liquid_task_token');
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  updateProfile: async (data) => {
    try {
      const res = await authService.updateProfile(data);
      set({ user: res.user });
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  changePassword: async (data) => {
    await authService.changePassword(data);
  },
}));
