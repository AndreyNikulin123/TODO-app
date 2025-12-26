import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TaskService } from '../../../services/task.service';
import prisma from '../../../config/database';
import { AppError } from '../../../utils/AppError';

// Мокируем Prisma
vi.mock('../../../config/database', () => ({
  default: {
    folder: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
    task: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('TaskService', () => {
  let taskService: TaskService;

  beforeEach(() => {
    taskService = new TaskService();
    // Очищаем все моки перед каждым тестом
    vi.clearAllMocks();
  });

  describe('createTask', () => {
    it('должен создавать задачу с корректными данными', async () => {
      const mockFolder = {
        id: 'folder-123',
        userId: 'user-123',
        name: 'Test Folder',
      };
      const mockTask = {
        id: 'task-123',
        title: 'Test Task',
        description: 'Test Description',
        folderId: 'folder-123',
        userId: 'user-123',
        priority: 'HIGH',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate: null,
      };

      // Мокируем поиск папки
      (prisma.folder.findFirst as any).mockResolvedValue(mockFolder);
      // Мокируем создание задачи
      (prisma.task.create as any).mockResolvedValue(mockTask);

      const result = await taskService.createTask('user-123', {
        title: 'Test Task',
        description: 'Test Description',
        folderId: 'folder-123',
        priority: 'HIGH',
      });

      expect(result).toEqual(mockTask);
      expect(prisma.folder.findFirst).toHaveBeenCalledWith({
        where: { id: 'folder-123', userId: 'user-123' },
      });
      expect(prisma.task.create).toHaveBeenCalled();
    });

    it('должен выбросить ошибку, если папка не найдена', async () => {
      // Мокируем ситуацию, когда папка не существует
      (prisma.folder.findFirst as any).mockResolvedValue(null);

      try {
        await taskService.createTask('user-123', {
          title: 'Test Task',
          folderId: 'nonexistent-folder',
        });
        expect.fail('Должна была выброситься ошибка');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(404);
      }
    });
  });

  describe('getTasks', () => {
    it('должен возвращать задачи пользователя из конкретной папки', async () => {
      const mockFolder = { id: 'folder-123', userId: 'user-123' };
      const mockTasks = [
        {
          id: 'task-1',
          title: 'Task 1',
          userId: 'user-123',
          folderId: 'folder-123',
          completed: false,
          priority: 'HIGH',
          description: null,
          dueDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          folder: mockFolder,
        },
      ];

      (prisma.folder.findFirst as any).mockResolvedValue(mockFolder);
      (prisma.task.findMany as any).mockResolvedValue(mockTasks);

      const result = await taskService.getTasks('user-123', {
        folderId: 'folder-123',
      });

      expect(result).toEqual(mockTasks);
      expect(prisma.task.findMany).toHaveBeenCalled();
    });

    it('должен возвращать все задачи пользователя, если folderId не указан', async () => {
      const mockUserFolders = [{ id: 'folder-1' }, { id: 'folder-2' }];
      const mockTasks = [
        {
          id: 'task-1',
          title: 'Task 1',
          userId: 'user-123',
          folderId: 'folder-1',
          completed: false,
          priority: 'MEDIUM',
          description: null,
          dueDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          folder: { id: 'folder-1' },
        },
      ];

      (prisma.folder.findMany as any).mockResolvedValue(mockUserFolders);
      (prisma.task.findMany as any).mockResolvedValue(mockTasks);

      const result = await taskService.getTasks('user-123', {});

      expect(result).toEqual(mockTasks);
      expect(prisma.folder.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        select: { id: true },
      });
    });

    it('должен фильтровать по статусу completed', async () => {
      const mockUserFolders = [{ id: 'folder-1' }];
      const mockTasks: any = [];

      (prisma.folder.findMany as any).mockResolvedValue(mockUserFolders);
      (prisma.task.findMany as any).mockResolvedValue(mockTasks);

      await taskService.getTasks('user-123', { completed: true });

      expect(prisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            completed: true,
          }),
        }),
      );
    });
  });

  describe('updateTask', () => {
    it('должен обновлять задачу', async () => {
      const mockTask = {
        id: 'task-123',
        title: 'Updated Task',
        userId: 'user-123',
        folderId: 'folder-123',
        completed: true,
        priority: 'HIGH',
        description: 'Updated description',
        dueDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.task.findFirst as any).mockResolvedValue(mockTask);
      (prisma.task.update as any).mockResolvedValue(mockTask);

      const result = await taskService.updateTask('task-123', 'user-123', {
        title: 'Updated Task',
        completed: true,
      });

      expect(result).toEqual(mockTask);
      expect(prisma.task.update).toHaveBeenCalled();
    });

    it('должен выбросить ошибку, если задача не найдена', async () => {
      (prisma.task.findFirst as any).mockResolvedValue(null);

      try {
        await taskService.updateTask('nonexistent', 'user-123', {
          title: 'Updated',
        });
        expect.fail('Должна была выброситься ошибка');
      } catch (error) {
        expect((error as AppError).statusCode).toBe(404);
      }
    });
  });

  describe('deleteTask', () => {
    it('должен удалять задачу', async () => {
      const mockTask = {
        id: 'task-123',
        title: 'Task to delete',
        userId: 'user-123',
        folderId: 'folder-123',
        completed: false,
        priority: 'LOW',
        description: null,
        dueDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.task.findFirst as any).mockResolvedValue(mockTask);
      (prisma.task.delete as any).mockResolvedValue(mockTask);

      await taskService.deleteTask('task-123', 'user-123');

      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: { id: 'task-123' },
      });
    });
  });
});
