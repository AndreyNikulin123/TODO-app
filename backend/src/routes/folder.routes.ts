import { validate } from '../validations/validator';
import {
  createFolderSchema,
  updateFolderSchema,
} from '../validations/folder.schema';
import { Router } from 'express';
import * as folderController from '../controllers/folder.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/', validate(createFolderSchema), folderController.createFolder);
router.get('/', folderController.getFolders);
router.get('/:id', folderController.getFolder);
router.put('/:id', validate(updateFolderSchema), folderController.updateFolder);
router.delete('/:id', folderController.deleteFolder);

export default router;
