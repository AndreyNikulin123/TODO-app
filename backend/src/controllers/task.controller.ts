import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { TaskService } from '../services/task.service';
import { asyncHandler } from '../utils/asyncHandler';
import { Priority } from '@prisma/client';

const taskService = new TaskService();

export const getTasks = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { folderId, completed, priority, search } = req.query;

    const tasks = await taskService.getTasks(req.userId!, {
      folderId: folderId as string,
      completed:
        completed === 'true' ? true : completed === 'false' ? false : undefined,
      priority: priority as Priority,
      search: search as string,
    });

    res.json(tasks);
  },
);

export const createTask = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const task = await taskService.createTask(req.userId!, req.body);
    res.status(201).json(task);
  },
);

export const updateTask = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const task = await taskService.updateTask(
      req.params.id,
      req.userId!,
      req.body,
    );
    res.status(200).json(task);
  },
);

export const deleteTask = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    await taskService.deleteTask(req.params.id, req.userId!);
    res.status(204).send();
  },
);
