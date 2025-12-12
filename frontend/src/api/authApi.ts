import type { AuthResponse } from '../types';
import { apiClient } from './client';

export const authApi = {
  register: (data: { email: string; password: string; name?: string }) =>
    apiClient.post<AuthResponse>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    apiClient.post<AuthResponse>('/auth/login', data),
};
