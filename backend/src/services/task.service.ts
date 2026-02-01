import { taskRepo } from '../repositories/task.repository';
import { authorizationService } from './authorization.service';
import { TaskStatus, UserRole } from '@prisma/client';

export const taskService = {
    getAllTasks: async () => {
        return await taskRepo.getAllTasks();
    },

    getTaskById: async (id: number) => {
        return await taskRepo.getTaskbyId(id);
    },

    createTask: async (title: string, description: string | undefined, requiredRole: UserRole, roomId: number, dueDate: string | undefined, userId: number) => {
        const canAssign = await authorizationService.canAssignTasks(userId, roomId);
        if (!canAssign) {
            throw new Error('You do not have permission to create tasks in this room');
        }
        return await taskRepo.createTask(title, description, requiredRole, roomId, dueDate ? new Date(dueDate) : undefined);
    },

    updateTaskStatus: async (id: number, status: TaskStatus) => {
        return await taskRepo.updateTaskStatus(id, status);
    },

    assignTask: async (id: number, assignedTo: number, userId: number, roomId: number) => {
        const canAssign = await authorizationService.canAssignTasks(userId, roomId);
        if (!canAssign) {
            throw new Error('You do not have permission to assign tasks');
        }
        return await taskRepo.assignTask(id, assignedTo);
    },

    submitTask: async (id: number, userId: number) => {
        const task = await taskRepo.getTaskbyId(id);
        if (!task) throw new Error('Task not found');
        if (task.assignedTo !== userId) throw new Error('You can only submit your own tasks');
        return await taskRepo.submitTask(id, userId);
    },

    approveTask: async (id: number, userId: number, roomId: number) => {
        const canApprove = await authorizationService.canApproveTasks(userId, roomId);
        if (!canApprove) throw new Error('You do not have permission to approve tasks');
        return await taskRepo.approveTask(id, userId);
    },

    rejectTask: async (id: number, userId: number, roomId: number, rejectionNote?: string) => {
        const canApprove = await authorizationService.canApproveTasks(userId, roomId);
        if (!canApprove) throw new Error('You do not have permission to reject tasks');
        return await taskRepo.rejectTask(id, rejectionNote);
    },

    deleteTask: async (id: number) => {
        return await taskRepo.deleteTask(id);
    },

    getTasksByRoom: async (roomId: number) => {
        return await taskRepo.getTasksByRoom(roomId);
    },

    getCompletedTasks: async (roomId: number) => {
        return await taskRepo.getCompletedTasks(roomId);
    },

    getTasksByAssignee: async (userId: number) => {
        return await taskRepo.getTasksByAssignee(userId);
    },
};
