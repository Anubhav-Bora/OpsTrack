import { Request, Response } from 'express';
import { taskDependencyService } from '../services/taskDependency.service';

// Type assertion helpers for Express 5.x compatibility
const getParams = (req: any) => req.params;
const getBody = (req: any) => req.body;

export const taskDependencyController = {
    getAllTaskDependencies: async (req: Request, res: Response) => {
        try {
            const dependencies = await taskDependencyService.getAllTaskDependencies();
            return (res as any).json(dependencies);
        } catch (error) {
            return (res as any).status(500).json({ error: 'Failed to fetch task dependencies' });
        }
    },

    getTaskDependencies: async (req: Request, res: Response) => {
        try {
            const { taskId } = getParams(req);
            const dependencies = await taskDependencyService.getTaskDependencies(Number(taskId));
            return (res as any).json(dependencies);
        } catch (error) {
            return (res as any).status(500).json({ error: 'Failed to fetch task dependencies' });
        }
    },

    getTaskDependents: async (req: Request, res: Response) => {
        try {
            const { taskId } = getParams(req);
            const dependents = await taskDependencyService.getTaskDependents(Number(taskId));
            return (res as any).json(dependents);
        } catch (error) {
            return (res as any).status(500).json({ error: 'Failed to fetch task dependents' });
        }
    },

    addTaskDependency: async (req: Request, res: Response) => {
        try {
            const { taskId, dependsOnTaskId } = getBody(req);
            const dependency = await taskDependencyService.addTaskDependency(
                Number(taskId),
                Number(dependsOnTaskId)
            );
            return (res as any).status(201).json(dependency);
        } catch (error: any) {
            return (res as any).status(400).json({ error: error.message || 'Failed to add task dependency' });
        }
    },

    removeTaskDependency: async (req: Request, res: Response) => {
        try {
            const { taskId, dependsOnTaskId } = getParams(req);
            await taskDependencyService.removeTaskDependency(Number(taskId), Number(dependsOnTaskId));
            return (res as any).json({ message: 'Task dependency removed' });
        } catch (error) {
            return (res as any).status(400).json({ error: 'Failed to remove task dependency' });
        }
    },
};
