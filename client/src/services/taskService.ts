import api from './api.js';
import { ITask, Status } from '../types/index.js';

export interface GetTasksParams {
  search?: string;
  category?: string;
  priority?: string;
  status?: string;
  view?: string;
  tag?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface TasksResponse {
  success: boolean;
  data: ITask[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const taskService = {
  async getTasks(params?: GetTasksParams): Promise<TasksResponse> {
    const res = await api.get<TasksResponse>('/tasks', { params });
    return res.data;
  },

  async getTaskById(id: string): Promise<{ success: boolean; data: ITask }> {
    const res = await api.get<{ success: boolean; data: ITask }>(`/tasks/${id}`);
    return res.data;
  },

  async createTask(data: Partial<ITask>): Promise<{ success: boolean; message: string; data: ITask }> {
    const res = await api.post<{ success: boolean; message: string; data: ITask }>('/tasks', data);
    return res.data;
  },

  async updateTask(id: string, data: Partial<ITask>): Promise<{ success: boolean; message: string; data: ITask }> {
    const res = await api.patch<{ success: boolean; message: string; data: ITask }>(`/tasks/${id}`, data);
    return res.data;
  },

  async deleteTask(id: string): Promise<{ success: boolean; message: string; data: { id: string } }> {
    const res = await api.delete<{ success: boolean; message: string; data: { id: string } }>(`/tasks/${id}`);
    return res.data;
  },

  async updateTaskStatus(id: string, status: Status): Promise<{ success: boolean; data: ITask }> {
    const res = await api.patch<{ success: boolean; data: ITask }>(`/tasks/${id}/status`, { status });
    return res.data;
  },

  async toggleSubtask(taskId: string, subtaskId: string): Promise<{ success: boolean; data: ITask }> {
    const res = await api.patch<{ success: boolean; data: ITask }>(`/tasks/${taskId}/subtasks/${subtaskId}`);
    return res.data;
  },

  async reorderKanban(taskId: string, newStatus: Status, newOrder?: number): Promise<{ success: boolean; data: ITask }> {
    const res = await api.post<{ success: boolean; data: ITask }>('/tasks/reorder', {
      taskId,
      newStatus,
      newOrder,
    });
    return res.data;
  },
};
