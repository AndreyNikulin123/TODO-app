import { Router } from 'express';
import * as taskController from '../controllers/task.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { createTaskSchema } from '../validations/task.schema';
import { validate } from '../validations/validator';
import { updateFolderSchema } from '../validations/folder.schema';

const router = Router();

router.use(authMiddleware);

router.post('/', validate(createTaskSchema), taskController.createTask);
router.get('/', taskController.getTasks);
router.put('/:id', validate(updateFolderSchema), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
