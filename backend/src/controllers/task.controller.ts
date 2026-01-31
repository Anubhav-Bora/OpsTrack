import { Response } from 'express';
import { taskService } from '../services/task.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const taskController = {
    getAllTasks: async (req: AuthRequest, res: Response) => {
        try {
            const tasks = await taskService.getAllTasks();
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch tasks' });
        }
    },

    getTaskById: async (req: AuthRequest, res: Response) => {
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

    createTask: async (req: AuthRequest, res: Response) => {
        try {
            const { title, requiredRole, roomId } = req.body;
            const task = await taskService.createTask(title, requiredRole, roomId, req.userId!);
            res.status(201).json(task);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },

    updateTaskStatus: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const task = await taskService.updateTaskStatus(Number(id), status);
            res.json(task);
        } catch (error) {
            res.status(400).json({ error: 'Failed to update task status' });
        }
    },

    assignTask: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const { assignedTo, roomId } = req.body;
            const task = await taskService.assignTask(Number(id), assignedTo, req.userId!, roomId);
            res.json(task);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },

    completeTask: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const task = await taskService.submitTask(Number(id), req.userId!);
            res.json(task);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },

    approveTask: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const { roomId } = req.body;
            const task = await taskService.approveTask(Number(id), req.userId!, roomId);
            res.json(task);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },

    rejectTask: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const { roomId } = req.body;
            const task = await taskService.rejectTask(Number(id), req.userId!, roomId);
            res.json(task);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },

    deleteTask: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            await taskService.deleteTask(Number(id));
            res.json({ message: 'Task deleted' });
        } catch (error) {
            res.status(400).json({ error: 'Failed to delete task' });
        }
    },

    getTasksByRoom: async (req: AuthRequest, res: Response) => {
        try {
            const { roomId } = req.params;
            const tasks = await taskService.getTasksByRoom(Number(roomId));
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch tasks' });
        }
    },

    getCompletedTasks: async (req: AuthRequest, res: Response) => {
        try {
            const { roomId } = req.params;
            const tasks = await taskService.getCompletedTasks(Number(roomId));
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch completed tasks' });
        }
    },

    getTasksByAssignee: async (req: AuthRequest, res: Response) => {
        try {
            const tasks = await taskService.getTasksByAssignee(req.userId!);
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch tasks' });
        }
    },
};
