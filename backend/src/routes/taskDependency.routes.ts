import { Router } from 'express';
import { taskDependencyController } from '../controllers/taskDependency.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, taskDependencyController.getAllTaskDependencies);
router.get('/task/:taskId', authMiddleware, taskDependencyController.getTaskDependencies);
router.get('/dependents/:taskId', authMiddleware, taskDependencyController.getTaskDependents);
router.post('/', authMiddleware, taskDependencyController.addTaskDependency);
router.delete('/:taskId/:dependsOnTaskId', authMiddleware, taskDependencyController.removeTaskDependency);

export default router;
