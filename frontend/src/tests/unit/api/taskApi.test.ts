/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { taskApi } from '../../../api/taskApi';
import { apiClient } from '../../../api/client';
import { Priority } from '../../../types';

vi.mock('../../../api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('taskApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('должен получить все задачи пользователя без фильтров', async () => {
      const mockTasks = {
        data: [
          {
            id: 'task-1',
            title: 'Task 1',
            completed: false,
            priority: 'HIGH',
            folderId: 'folder-1',
            description: null,
            dueDate: null,
            userId: 'user-1',
            createdAt: new Date(),
            updatedAt: new Date(),
            folder: { id: 'folder-1', name: 'Folder 1', color: '#3B82F6' },
          },
          {
            id: 'task-2',
            title: 'Task 2',
            completed: true,
            priority: 'LOW',
            folderId: 'folder-1',
            description: null,
            dueDate: null,
            userId: 'user-1',
            createdAt: new Date(),
            updatedAt: new Date(),
            folder: { id: 'folder-1', name: 'Folder 1', color: '#3B82F6' },
          },
        ],
      };

      (apiClient.get as any).mockResolvedValue(mockTasks);

      // ✅ Вызов БЕЗ параметров
      const result = await taskApi.getAll();

      expect(result).toEqual(mockTasks);
      // ✅ Проверяем что передался undefined в params
      expect(apiClient.get).toHaveBeenCalledWith('/tasks', {
        params: undefined,
      });
      expect(apiClient.get).toHaveBeenCalledTimes(1);
    });

    it('должен получить задачи с фильтром по папке', async () => {
      const mockTasks = {
        data: [
          {
            id: 'task-1',
            title: 'Task in Folder 1',
            folderId: 'folder-123',
            completed: false,
            priority: 'MEDIUM',
            description: null,
            dueDate: null,
            userId: 'user-1',
            createdAt: new Date(),
            updatedAt: new Date(),
            folder: { id: 'folder-123', name: 'Folder 1', color: '#3B82F6' },
          },
        ],
      };

      (apiClient.get as any).mockResolvedValue(mockTasks);

      // ✅ Вызов С параметром folderId
      const result = await taskApi.getAll({ folderId: 'folder-123' });

      expect(result).toEqual(mockTasks);
      expect(apiClient.get).toHaveBeenCalledWith('/tasks', {
        params: { folderId: 'folder-123' },
      });
    });

    it('должен получить задачи с фильтром по статусу completed', async () => {
      const mockTasks = {
        data: [
          {
            id: 'task-1',
            title: 'Completed Task',
            completed: true,
            priority: 'HIGH',
            folderId: 'folder-1',
            description: null,
            dueDate: null,
            userId: 'user-1',
            createdAt: new Date(),
            updatedAt: new Date(),
            folder: { id: 'folder-1', name: 'Folder 1', color: '#3B82F6' },
          },
        ],
      };

      (apiClient.get as any).mockResolvedValue(mockTasks);

      // ✅ Вызов С параметром completed
      const result = await taskApi.getAll({ completed: true });

      expect(result).toEqual(mockTasks);
      expect(apiClient.get).toHaveBeenCalledWith('/tasks', {
        params: { completed: true },
      });
    });

    it('должен получить задачи с фильтром по приоритету', async () => {
      const mockTasks = {
        data: [
          {
            id: 'task-1',
            title: 'High Priority Task',
            priority: 'HIGH',
            completed: false,
            folderId: 'folder-1',
            description: null,
            dueDate: null,
            userId: 'user-1',
            createdAt: new Date(),
            updatedAt: new Date(),
            folder: { id: 'folder-1', name: 'Folder 1', color: '#3B82F6' },
          },
        ],
      };

      (apiClient.get as any).mockResolvedValue(mockTasks);

      // ✅ Вызов С параметром priority
      const result = await taskApi.getAll({ priority: 'HIGH' });

      expect(result).toEqual(mockTasks);
      expect(apiClient.get).toHaveBeenCalledWith('/tasks', {
        params: { priority: 'HIGH' },
      });
    });

    it('должен получить задачи с поиском по названию', async () => {
      const mockTasks = {
        data: [
          {
            id: 'task-1',
            title: 'Buy groceries',
            search: 'buy',
            completed: false,
            priority: 'MEDIUM',
            folderId: 'folder-1',
            description: null,
            dueDate: null,
            userId: 'user-1',
            createdAt: new Date(),
            updatedAt: new Date(),
            folder: { id: 'folder-1', name: 'Folder 1', color: '#3B82F6' },
          },
        ],
      };

      (apiClient.get as any).mockResolvedValue(mockTasks);

      // ✅ Вызов С параметром search
      const result = await taskApi.getAll({ search: 'buy' });

      expect(result).toEqual(mockTasks);
      expect(apiClient.get).toHaveBeenCalledWith('/tasks', {
        params: { search: 'buy' },
      });
    });

    it('должен получить задачи с несколькими фильтрами', async () => {
      const mockTasks = {
        data: [
          {
            id: 'task-1',
            title: 'Buy High Priority',
            folderId: 'folder-123',
            priority: 'HIGH',
            completed: false,
            description: null,
            dueDate: null,
            userId: 'user-1',
            createdAt: new Date(),
            updatedAt: new Date(),
            folder: { id: 'folder-123', name: 'Folder 1', color: '#3B82F6' },
          },
        ],
      };

      (apiClient.get as any).mockResolvedValue(mockTasks);

      // ✅ Вызов С несколькими параметрами
      const result = await taskApi.getAll({
        folderId: 'folder-123',
        priority: 'HIGH',
        completed: false,
      });

      expect(result).toEqual(mockTasks);
      expect(apiClient.get).toHaveBeenCalledWith('/tasks', {
        params: {
          folderId: 'folder-123',
          priority: 'HIGH',
          completed: false,
        },
      });
    });
  });

  describe('create', () => {
    it('должен создать новую задачу', async () => {
      const newTask = {
        title: 'New Task',
        description: 'Task Description',
        folderId: 'folder-123',
        priority: Priority.HIGH,
        completed: false,
      };

      const mockResponse = {
        data: {
          id: 'task-123',
          ...newTask,
          userId: 'user-1',
          dueDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          folder: { id: 'folder-123', name: 'Folder 1', color: '#3B82F6' },
        },
      };

      (apiClient.post as any).mockResolvedValue(mockResponse);

      const result = await taskApi.create(newTask);

      expect(result).toEqual(mockResponse);
      expect(apiClient.post).toHaveBeenCalledWith('/tasks', newTask);
      expect(apiClient.post).toHaveBeenCalledTimes(1);
    });

    it('должен бросить ошибку если папка не найдена', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Folder not found' },
        },
      };

      (apiClient.post as any).mockRejectedValue(mockError);

      try {
        await taskApi.create({
          title: 'Task',
          folderId: 'nonexistent',
          completed: true,
          priority: Priority.HIGH,
        });
        expect.fail('Должна была выброситься ошибка');
      } catch (error: any) {
        expect(error.response.status).toBe(404);
        expect(error.response.data.message).toBe('Folder not found');
      }
    });

    it('должен бросить ошибку при ошибке валидации', async () => {
      const mockError = {
        response: {
          status: 400,
          data: { message: 'Invalid task data' },
        },
      };

      (apiClient.post as any).mockRejectedValue(mockError);

      try {
        await taskApi.create({
          title: '', // пустой title
          folderId: 'folder-123',
          completed: true,
          priority: Priority.HIGH,
        });
        expect.fail('Должна была выброситься ошибка');
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });
  });

  describe('update', () => {
    it('должен обновить существующую задачу', async () => {
      const taskId = 'task-123';
      const updateData = {
        title: 'Updated Task',
        completed: true,
      };

      const mockResponse = {
        data: {
          id: taskId,
          ...updateData,
          priority: 'HIGH',
          folderId: 'folder-1',
          description: null,
          dueDate: null,
          userId: 'user-1',
          createdAt: new Date(),
          updatedAt: new Date(),
          folder: { id: 'folder-1', name: 'Folder 1', color: '#3B82F6' },
        },
      };

      (apiClient.put as any).mockResolvedValue(mockResponse);

      const result = await taskApi.update(taskId, updateData);

      expect(result).toEqual(mockResponse);
      expect(apiClient.put).toHaveBeenCalledWith(
        `/tasks/${taskId}`,
        updateData,
      );
      expect(apiClient.put).toHaveBeenCalledTimes(1);
    });

    it('должен обновить только статус задачи', async () => {
      const taskId = 'task-123';
      const updateData = { completed: true };

      const mockResponse = {
        data: {
          id: taskId,
          title: 'Task Title',
          completed: true,
          priority: 'MEDIUM',
          folderId: 'folder-1',
          description: null,
          dueDate: null,
          userId: 'user-1',
          createdAt: new Date(),
          updatedAt: new Date(),
          folder: { id: 'folder-1', name: 'Folder 1', color: '#3B82F6' },
        },
      };

      (apiClient.put as any).mockResolvedValue(mockResponse);

      const result = await taskApi.update(taskId, updateData);

      expect(result).toEqual(mockResponse);
      expect(apiClient.put).toHaveBeenCalledWith(
        `/tasks/${taskId}`,
        updateData,
      );
    });

    it('должен бросить ошибку если задача не найдена', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Task not found' },
        },
      };

      (apiClient.put as any).mockRejectedValue(mockError);

      try {
        await taskApi.update('nonexistent', { title: 'Updated' });
        expect.fail('Должна была выброситься ошибка');
      } catch (error: any) {
        expect(error.response.status).toBe(404);
        expect(error.response.data.message).toBe('Task not found');
      }
    });
  });

  describe('delete', () => {
    it('должен удалить задачу', async () => {
      const taskId = 'task-123';
      const mockResponse = { status: 204 };

      (apiClient.delete as any).mockResolvedValue(mockResponse);

      const result = await taskApi.delete(taskId);

      expect(result).toEqual(mockResponse);
      expect(apiClient.delete).toHaveBeenCalledWith(`/tasks/${taskId}`);
      expect(apiClient.delete).toHaveBeenCalledTimes(1);
    });

    it('должен бросить ошибку если задача не найдена', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Task not found' },
        },
      };

      (apiClient.delete as any).mockRejectedValue(mockError);

      try {
        await taskApi.delete('nonexistent');
        expect.fail('Должна была выброситься ошибка');
      } catch (error: any) {
        expect(error.response.status).toBe(404);
        expect(error.response.data.message).toBe('Task not found');
      }
    });

    it('должен обработать ошибку авторизации', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      };

      (apiClient.delete as any).mockRejectedValue(mockError);

      try {
        await taskApi.delete('task-123');
        expect.fail('Должна была выброситься ошибка');
      } catch (error: any) {
        expect(error.response.status).toBe(401);
      }
    });
  });
});
