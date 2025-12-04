import { Priority } from '@prisma/client';
import { AppError } from '../utils/AppError';
import prisma from '../config/database';

interface TaskFilters {
  folderId?: string;
  completed?: boolean;
  priority?: Priority;
  search?: string;
}

export class TaskService {
  async createTask(
    userId: string,
    data: {
      title: string;
      description?: string;
      folderId: string;
      priority?: Priority;
      dueDate?: Date;
    },
  ) {
    const folder = await prisma.folder.findFirst({
      where: { id: data.folderId, userId },
    });

    if (!folder) {
      throw new AppError(404, 'Folder not found or access denied', true);
    }

    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        folderId: data.folderId,
        priority: data.priority,
        dueDate: data.dueDate,
      },
    });
  }

  async getTasks(userId: string, filters: TaskFilters) {
    const where: any = { userId };

    if (filters.folderId) {
      const folder = await prisma.folder.findFirst({
        where: { id: filters.folderId, userId },
      });
      if (!folder) {
        throw new AppError(404, 'Folder not found', true);
      }
      where.folderId = filters.folderId;
    } else {
      // Получаем все папки пользователя
      const userFolders = await prisma.folder.findMany({
        where: { userId },
        select: { id: true },
      });
      where.folderId = { in: userFolders.map((f) => f.id) };
    }

    if (filters.completed !== undefined) {
      where.completed = filters.completed;
    }

    if (filters.priority) {
      where.priority = filters.priority;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return prisma.task.findMany({
      where,
      include: {
        folder: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
  async updateTask(
    id: string,
    userId: string,
    data: {
      title?: string;
      description?: string;
      folderId?: string;
      priority?: Priority;
      dueDate?: Date;
    },
  ) {
    const task = await prisma.task.findFirst({
      where: {
        id,
        folder: { userId },
      },
    });

    if (!task) {
      throw new AppError(404, 'Task not found', true);
    }

    const updateData: any = { ...data };
    if (data.folderId) {
      updateData.folder = { connect: { id: data.folderId } };
      delete updateData.folderId;
    }

    return prisma.task.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteTask(id: string, userId: string) {
    const task = await prisma.task.findFirst({
      where: {
        id,
        folder: { userId },
      },
    });

    if (!task) {
      throw new AppError(404, 'Task not found', true);
    }

    await prisma.task.delete({
      where: { id },
    });
  }
}
