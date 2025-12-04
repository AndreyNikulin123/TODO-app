import type { Task } from "../types";
import { apiClient } from "./client";

export const taskApi = {
  getAll: (params?: {
    folderId?: string;
    completed?: boolean;
    priority?: string;
    search?: string;
  }) => apiClient.get<Task[]>("/tasks", { params }),

  create: (data: Omit<Task, "id" | "createdAt" | "updatedAt">) =>
    apiClient.post<Task>("/tasks", data),

  update: (
    id: string,
    data: Partial<Omit<Task, "id" | "createdAt" | "updatedAt" | "userId">>
  ) => apiClient.put<Task>(`/tasks/${id}`, data),

  delete: (id: string) => apiClient.delete<Task>(`/tasks/${id}`),
};
