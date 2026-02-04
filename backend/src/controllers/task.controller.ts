import { Response } from 'express';
import { taskService } from '../services/task.service';
import { AuthRequest } from '../middlewares/auth.middleware';

// Type assertion helpers for Express 5.x compatibility
const getParams = (req: any) => req.params;
const getBody = (req: any) => req.body;

export const taskController = {
    getAllTasks: async (req: AuthRequest, res: Response) => {
        try {
            const tasks = await taskService.getAllTasks();
            return (res as any).json(tasks);
        } catch (error) {
            return (res as any).status(500).json({ error: 'Failed to fetch tasks' });
        }
    },

    getTaskById: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = getParams(req);
            const task = await taskService.getTaskById(Number(id));
            if (!task) {
                return (res as any).status(404).json({ error: 'Task not found' });
            }
            return (res as any).json(task);
        } catch (error) {
            return (res as any).status(500).json({ error: 'Failed to fetch task' });
        }
    },

    createTask: async (req: AuthRequest, res: Response) => {
        try {
            const { title, description, requiredRole = 'BACKEND', roomId, dueDate, assigneeId } = getBody(req);
            if (!title) {
                return (res as any).status(400).json({ error: 'Title is required' });
            }
            if (!roomId) {
                return (res as any).status(400).json({ error: 'Room ID is required' });
            }
            const task = await taskService.createTask(title, description, requiredRole, roomId, dueDate, Number(req.userId!), assigneeId);
            return (res as any).status(201).json(task);
        } catch (error: any) {
            return (res as any).status(400).json({ error: error.message });
        }
    },

    updateTaskStatus: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = getParams(req);
            const { status } = getBody(req);
            const task = await taskService.updateTaskStatus(Number(id), status, Number(req.userId!));
            return (res as any).json(task);
        } catch (error: any) {
            return (res as any).status(400).json({ error: error.message || 'Failed to update task status' });
        }
    },

    updateTask: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = getParams(req);
            const { title, description, requiredRole, dueDate, roomId } = getBody(req);
            const task = await taskService.updateTask(Number(id), title, description, requiredRole, dueDate, Number(req.userId!), roomId);
            return (res as any).json(task);
        } catch (error: any) {
            return (res as any).status(400).json({ error: error.message });
        }
    },

    assignTask: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = getParams(req);
            const { assignedTo, roomId } = getBody(req);
            const task = await taskService.assignTask(Number(id), assignedTo, Number(req.userId!), roomId);
            return (res as any).json(task);
        } catch (error: any) {
            return (res as any).status(400).json({ error: error.message });
        }
    },

    completeTask: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = getParams(req);
            const task = await taskService.submitTask(Number(id), Number(req.userId!));
            return (res as any).json(task);
        } catch (error: any) {
            return (res as any).status(400).json({ error: error.message });
        }
    },

    approveTask: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = getParams(req);
            const { roomId } = getBody(req);
            const task = await taskService.approveTask(Number(id), Number(req.userId!), roomId);
            return (res as any).json(task);
        } catch (error: any) {
            return (res as any).status(400).json({ error: error.message });
        }
    },

    rejectTask: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = getParams(req);
            const { roomId, rejectionNote } = getBody(req);
            const task = await taskService.rejectTask(Number(id), Number(req.userId!), roomId, rejectionNote);
            return (res as any).json(task);
        } catch (error: any) {
            return (res as any).status(400).json({ error: error.message });
        }
    },

    deleteTask: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = getParams(req);
            const { roomId } = getBody(req);
            await taskService.deleteTask(Number(id), Number(req.userId!), roomId ? Number(roomId) : undefined);
            return (res as any).json({ message: 'Task deleted' });
        } catch (error: any) {
            return (res as any).status(400).json({ error: error.message });
        }
    },

    getTasksByRoom: async (req: AuthRequest, res: Response) => {
        try {
            const { roomId } = getParams(req);
            const tasks = await taskService.getTasksByRoom(Number(roomId));
            return (res as any).json(tasks);
        } catch (error) {
            return (res as any).status(500).json({ error: 'Failed to fetch tasks' });
        }
    },

    getCompletedTasks: async (req: AuthRequest, res: Response) => {
        try {
            const { roomId } = getParams(req);
            const tasks = await taskService.getCompletedTasks(Number(roomId));
            return (res as any).json(tasks);
        } catch (error) {
            return (res as any).status(500).json({ error: 'Failed to fetch completed tasks' });
        }
    },

    getTasksByAssignee: async (req: AuthRequest, res: Response) => {
        try {
            const userId = Number(req.userId!);
            const tasks = await taskService.getTasksByAssignee(userId);
            return (res as any).json(tasks);
        } catch (error) {
            return (res as any).status(500).json({ error: 'Failed to fetch tasks' });
        }
    },
};
