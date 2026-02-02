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

    createTask: async (title: string, description: string | undefined, requiredRole: UserRole, roomId: number, dueDate: string | undefined, userId: number, assigneeId?: number) => {
        const canAssign = await authorizationService.canAssignTasks(userId, roomId);
        if (!canAssign) {
            throw new Error('You do not have permission to create tasks in this room');
        }
        return await taskRepo.createTask(title, description, requiredRole, roomId, dueDate ? new Date(dueDate) : undefined, assigneeId);
    },

    updateTaskStatus: async (id: number, status: TaskStatus) => {
        return await taskRepo.updateTaskStatus(id, status);
    },

    updateTask: async (id: number, title: string, description: string | undefined, requiredRole: UserRole, dueDate: string | undefined, userId: number, roomId: number) => {
        const canAssign = await authorizationService.canAssignTasks(userId, roomId);
        if (!canAssign) {
            throw new Error('You do not have permission to edit tasks in this room');
        }
        return await taskRepo.updateTask(id, title, description, requiredRole, dueDate ? new Date(dueDate) : undefined);
    },

    assignTask: async (id: number, assignedTo: number, userId: number, roomId: number) => {
        console.log(`[Task Service] assignTask - taskId: ${id}, assignedTo: ${assignedTo}, userId: ${userId}, roomId: ${roomId}`);
        const canAssign = await authorizationService.canAssignTasks(userId, roomId);
        console.log(`[Task Service] Can assign tasks: ${canAssign}`);
        if (!canAssign) {
            throw new Error('You do not have permission to assign tasks');
        }
        const result = await taskRepo.assignTask(id, assignedTo);
        console.log(`[Task Service] Task assigned:`, { id: result.id, assignedTo: result.assignedTo });
        return result;
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

    deleteTask: async (id: number, userId: number, roomId?: number) => {
        // If roomId is provided, check authorization
        if (roomId) {
            const canDelete = await authorizationService.canAssignTasks(userId, roomId);
            if (!canDelete) {
                throw new Error('You do not have permission to delete tasks');
            }
        } else {
            // If roomId is not provided, fetch the task to get its roomId and check authorization
            const task = await taskRepo.getTaskbyId(id);
            if (!task) {
                throw new Error('Task not found');
            }
            const canDelete = await authorizationService.canAssignTasks(userId, task.roomId);
            if (!canDelete) {
                throw new Error('You do not have permission to delete tasks');
            }
        }
        return await taskRepo.deleteTask(id);
    },

    getTasksByRoom: async (roomId: number) => {
        return await taskRepo.getTasksByRoom(roomId);
    },

    getCompletedTasks: async (roomId: number) => {
        return await taskRepo.getCompletedTasks(roomId);
    },

    getTasksByAssignee: async (userId: number) => {
        console.log(`[Task Service] getTasksByAssignee for userId: ${userId}, type: ${typeof userId}`);
        const tasks = await taskRepo.getTasksByAssignee(userId);
        console.log(`[Task Service] Found ${tasks.length} tasks`);
        return tasks;
    },
};
