import type { Task } from '../types';
import { apiClient } from './client';

export const taskApi = {
  create: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    return apiClient.post<Task>('/tasks', data);
  },
  getAll: (params?: {
    folderId?: string;
    completed?: boolean;
    priority?: string;
    search?: string;
  }) => apiClient.get<Task[]>('/tasks', { params }),

  update: (
    id: string,
    data: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>,
  ) => {
    return apiClient.patch<Task>(`/tasks/${id}`, data);
  },

  delete: (id: string) => apiClient.delete<Task>(`/tasks/${id}`),
};
