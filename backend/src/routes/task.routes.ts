import { Router } from 'express';
import { taskController } from '../controllers/task.controller';

const router = Router();

router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createTask);
router.put('/:id/status', taskController.updateTaskStatus);
router.put('/:id/assign', taskController.assignTask);
router.delete('/:id', taskController.deleteTask);

export default router;
