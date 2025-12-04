// import { PrismaClient } from '@prisma/client';
import prisma from '../config/database';
import { AppError } from '../utils/AppError';

export class FolderService {
  async createFolder(userId: string, name: string, color?: string) {
    return prisma.folder.create({
      data: {
        name,
        color,
        userId,
      },
    });
  }

  async getFolders(userId: string) {
    return prisma.folder.findMany({
      where: { userId },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getFolderById(id: string, userId: string) {
    const folder = await prisma.folder.findFirst({
      where: { id, userId },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!folder) {
      throw new AppError(404, 'Folder not found', true);
    }

    return folder;
  }

  async updateFolder(
    id: string,
    userId: string,
    data: { name?: string; color?: string },
  ) {
    const folder = await prisma.folder.findFirst({
      where: { id, userId },
    });
    if (!folder) {
      throw new AppError(404, 'Folder not found', true);
    }

    return prisma.folder.update({
      where: { id },
      data,
    });
  }

  async deleteFolder(id: string, userId: string) {
    const folder = await prisma.folder.findFirst({
      where: { id, userId },
    });
    if (!folder) {
      throw new AppError(404, 'Folder not found', true);
    }
    return prisma.folder.delete({
      where: { id },
    });
  }
}
