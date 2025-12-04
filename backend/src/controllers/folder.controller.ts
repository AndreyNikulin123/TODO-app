import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { FolderService } from '../services/folder.service';
import { asyncHandler } from '../utils/asyncHandler';

const folderService = new FolderService();

export const createFolder = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, color } = req.body;

    const folder = await folderService.createFolder(req.userId!, name, color);
    res.status(201).json(folder);
  },
);

export const getFolders = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const folders = await folderService.getFolders(req.userId!);
    res.json(folders);
  },
);

export const getFolder = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const folder = await folderService.getFolderById(
      req.params.id,
      req.userId!,
    );
    res.json(folder);
  },
);

export const updateFolder = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { name, color } = req.body;

    const folder = await folderService.updateFolder(
      req.params.id,
      req.userId!,
      {
        name,
        color,
      },
    );
    res.json(folder);
  },
);

export const deleteFolder = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    await folderService.deleteFolder(req.params.id, req.userId!);
    res.status(204).send();
  },
);
