import { Request, Response } from 'express';
import { taskDependencyService } from '../services/taskDependency.service';

export const taskDependencyController = {
    getAllTaskDependencies: async (req: Request, res: Response) => {
        try {
            const dependencies = await taskDependencyService.getAllTaskDependencies();
            res.json(dependencies);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch task dependencies' });
        }
    },

    getTaskDependencies: async (req: Request, res: Response) => {
        try {
            const { taskId } = req.params;
            const dependencies = await taskDependencyService.getTaskDependencies(Number(taskId));
            res.json(dependencies);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch task dependencies' });
        }
    },

    getTaskDependents: async (req: Request, res: Response) => {
        try {
            const { taskId } = req.params;
            const dependents = await taskDependencyService.getTaskDependents(Number(taskId));
            res.json(dependents);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch task dependents' });
        }
    },

    addTaskDependency: async (req: Request, res: Response) => {
        try {
            const { taskId, dependsOnTaskId } = req.body;
            const dependency = await taskDependencyService.addTaskDependency(
                Number(taskId), 
                Number(dependsOnTaskId)
            );
            res.status(201).json(dependency);
        } catch (error: any) {
            res.status(400).json({ error: error.message || 'Failed to add task dependency' });
        }
    },

    removeTaskDependency: async (req: Request, res: Response) => {
        try {
            const { taskId, dependsOnTaskId } = req.params;
            await taskDependencyService.removeTaskDependency(Number(taskId), Number(dependsOnTaskId));
            res.json({ message: 'Task dependency removed' });
        } catch (error) {
            res.status(400).json({ error: 'Failed to remove task dependency' });
        }
    },
};
