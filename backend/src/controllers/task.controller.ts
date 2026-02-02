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
            const { title, description, requiredRole = 'BACKEND', roomId, dueDate, assigneeId } = req.body;
            if (!title) {
                return res.status(400).json({ error: 'Title is required' });
            }
            if (!roomId) {
                return res.status(400).json({ error: 'Room ID is required' });
            }
            const task = await taskService.createTask(title, description, requiredRole, roomId, dueDate, Number(req.userId!), assigneeId);
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

    updateTask: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const { title, description, requiredRole, dueDate, roomId } = req.body;
            const task = await taskService.updateTask(Number(id), title, description, requiredRole, dueDate, Number(req.userId!), roomId);
            res.json(task);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },

    assignTask: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const { assignedTo, roomId } = req.body;
            console.log(`[Task Controller] assignTask - taskId: ${id}, assignedTo: ${assignedTo}, roomId: ${roomId}, requestedBy: ${req.userId}`);
            const task = await taskService.assignTask(Number(id), assignedTo, Number(req.userId!), roomId);
            console.log(`[Task Controller] Task assigned successfully:`, { taskId: task.id, assignedTo: task.assignedTo, title: task.title });
            res.json(task);
        } catch (error: any) {
            console.error(`[Task Controller] assignTask error:`, error.message);
            res.status(400).json({ error: error.message });
        }
    },

    completeTask: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const task = await taskService.submitTask(Number(id), Number(req.userId!));
            res.json(task);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },

    approveTask: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const { roomId } = req.body;
            const task = await taskService.approveTask(Number(id), Number(req.userId!), roomId);
            res.json(task);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },

    rejectTask: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const { roomId, rejectionNote } = req.body;
            const task = await taskService.rejectTask(Number(id), Number(req.userId!), roomId, rejectionNote);
            res.json(task);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },

    deleteTask: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const { roomId } = req.body;
            await taskService.deleteTask(Number(id), Number(req.userId!), roomId ? Number(roomId) : undefined);
            res.json({ message: 'Task deleted' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
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
            const userId = Number(req.userId!);
            console.log(`[Task Controller] Fetching tasks for user ${userId}`);
            const tasks = await taskService.getTasksByAssignee(userId);
            console.log(`[Task Controller] Found ${tasks.length} tasks for user ${userId}`);
            if (tasks.length > 0) {
                console.log(`[Task Controller] Task details:`, tasks.map(t => ({ id: t.id, title: t.title, assignedTo: t.assignedTo })));
            }
            res.json(tasks);
        } catch (error) {
            console.error('Get tasks by assignee error:', error);
            res.status(500).json({ error: 'Failed to fetch tasks' });
        }
    },
};
