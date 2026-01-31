import { Router } from 'express';
import { taskDependencyController } from '../controllers/taskDependency.controller';

const router = Router();

router.get('/', taskDependencyController.getAllTaskDependencies);
router.get('/task/:taskId', taskDependencyController.getTaskDependencies);
router.get('/dependents/:taskId', taskDependencyController.getTaskDependents);
router.post('/', taskDependencyController.addTaskDependency);
router.delete('/:taskId/:dependsOnTaskId', taskDependencyController.removeTaskDependency);

export default router;
