import { Request, Response } from 'express';
import { taskService } from '../services/task.service';

export const taskController = {
    getAllTasks: async (req: Request, res: Response) => {
        try {
            const tasks = await taskService.getAllTasks();
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch tasks' });
        }
    },

    getTaskById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const task = await taskService.getTaskById(Number(id));
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json(task);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch task' });
        }
    },

    createTask: async (req: Request, res: Response) => {
        try {
            const { title, requiredRole, roomId } = req.body;
            const task = await taskService.createTask(title, requiredRole, roomId);
            res.status(201).json(task);
        } catch (error) {
            res.status(400).json({ error: 'Failed to create task' });
        }
    },

    updateTaskStatus: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const task = await taskService.updateTaskStatus(Number(id), status);
            res.json(task);
        } catch (error) {
            res.status(400).json({ error: 'Failed to update task status' });
        }
    },

    assignTask: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { assignedTo } = req.body;
            const task = await taskService.assignTask(Number(id), assignedTo);
            res.json(task);
        } catch (error) {
            res.status(400).json({ error: 'Failed to assign task' });
        }
    },

    deleteTask: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await taskService.deleteTask(Number(id));
            res.json({ message: 'Task deleted' });
        } catch (error) {
            res.status(400).json({ error: 'Failed to delete task' });
        }
    },
};
