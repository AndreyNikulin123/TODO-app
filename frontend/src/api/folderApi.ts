import type { Folder } from "../types";
import { apiClient } from "./client";

export const folderApi = {
  getAll: () => apiClient.get<Folder[]>("/folders"),

  getById: (id: string) => apiClient.get<Folder>(`/folders/${id}`),

  create: (data: { name: string; color?: string }) =>
    apiClient.post<Folder>("/folders", data),

  update: (id: string, data: { name?: string; color?: string }) =>
    apiClient.put(`/folders/${id}`, data),

  delete: (id: string) => apiClient.delete(`/folders/${id}`),
};
