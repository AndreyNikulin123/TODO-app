import { Router } from 'express';
import * as folderController from '../controllers/folder.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/', folderController.createFolder);
router.get('/', folderController.getFolders);
router.get('/:id', folderController.getFolder);
router.put('/:id', folderController.updateFolder);
router.delete('/:id', folderController.deleteFolder);

export default router;
