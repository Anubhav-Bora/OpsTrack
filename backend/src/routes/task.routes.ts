import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Specific routes first (before :id)
router.get('/assignee/my-tasks', authMiddleware, taskController.getTasksByAssignee);
router.get('/room/:roomId', authMiddleware, taskController.getTasksByRoom);
router.get('/completed/:roomId', authMiddleware, taskController.getCompletedTasks);

// General routes
router.get('/', authMiddleware, taskController.getAllTasks);
router.post('/', authMiddleware, taskController.createTask);

// ID-based routes (after specific routes)
router.get('/:id', authMiddleware, taskController.getTaskById);
router.put('/:id/status', authMiddleware, taskController.updateTaskStatus);
router.put('/:id/assign', authMiddleware, taskController.assignTask);
router.put('/:id/submit', authMiddleware, taskController.completeTask);
router.put('/:id/approve', authMiddleware, taskController.approveTask);
router.put('/:id/reject', authMiddleware, taskController.rejectTask);
router.delete('/:id', authMiddleware, taskController.deleteTask);

export default router;
