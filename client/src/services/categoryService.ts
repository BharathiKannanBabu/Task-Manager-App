import api from './api.js';
import { ICategory } from '../types/index.js';

export const categoryService = {
  async getCategories(): Promise<{ success: boolean; data: ICategory[] }> {
    const res = await api.get<{ success: boolean; data: ICategory[] }>('/categories');
    return res.data;
  },

  async createCategory(data: { name: string; color?: string; icon?: string }): Promise<{ success: boolean; data: ICategory }> {
    const res = await api.post<{ success: boolean; data: ICategory }>('/categories', data);
    return res.data;
  },

  async updateCategory(id: string, data: Partial<ICategory>): Promise<{ success: boolean; data: ICategory }> {
    const res = await api.patch<{ success: boolean; data: ICategory }>(`/categories/${id}`, data);
    return res.data;
  },

  async deleteCategory(id: string): Promise<{ success: boolean; data: { id: string } }> {
    const res = await api.delete<{ success: boolean; data: { id: string } }>(`/categories/${id}`);
    return res.data;
  },
};
