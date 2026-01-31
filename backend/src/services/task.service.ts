import { taskRepo } from '../repositories/task.repository';
import { TaskStatus, UserRole } from '@prisma/client';

export const taskService = {
    getAllTasks: async () => {
        return await taskRepo.getAllTasks();
    },

    getTaskById: async (id: number) => {
        return await taskRepo.getTaskbyId(id);
    },

    createTask: async (title: string, requiredRole: UserRole, roomId: number) => {
        return await taskRepo.createTask(title, requiredRole, roomId);
    },

    updateTaskStatus: async (id: number, status: TaskStatus) => {
        return await taskRepo.updateTaskStatus(id, status);
    },

    assignTask: async (id: number, assignedTo: number) => {
        return await taskRepo.assignTask(id, assignedTo);
    },

    deleteTask: async (id: number) => {
        return await taskRepo.deleteTask(id);
    },
};
