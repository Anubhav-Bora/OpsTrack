import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, taskController.getAllTasks);
router.get('/room/:roomId', authMiddleware, taskController.getTasksByRoom);
router.get('/completed/:roomId', authMiddleware, taskController.getCompletedTasks);
router.get('/assignee/my-tasks', authMiddleware, taskController.getTasksByAssignee);
router.get('/:id', authMiddleware, taskController.getTaskById);
router.post('/', authMiddleware, taskController.createTask);
router.put('/:id/status', authMiddleware, taskController.updateTaskStatus);
router.put('/:id/assign', authMiddleware, taskController.assignTask);
router.put('/:id/complete', authMiddleware, taskController.completeTask);
router.delete('/:id', authMiddleware, taskController.deleteTask);

export default router;
