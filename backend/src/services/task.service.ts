import { taskRepo } from '../repositories/task.repository';
import { taskDependencyRepo } from '../repositories/taskDependency.repository';
import { authorizationService } from './authorization.service';

type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'BLOCKED';
type UserRole = 'ADMIN' | 'BACKEND' | 'FRONTEND' | 'DEVOPS' | 'CYBERSECURITY';

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

    updateTaskStatus: async (id: number, status: TaskStatus, userId?: number) => {
        const task = await taskRepo.getTaskbyId(id);
        if (!task) throw new Error('Task not found');

        // Validate dependencies for statuses that require all dependencies to be completed
        if (status === 'IN_PROGRESS' || status === 'SUBMITTED') {
            const dependencies = await taskDependencyRepo.getTaskDependencies(id);
            if (dependencies.length > 0) {
                const incompleteDeps = dependencies.filter((dep: any) => dep.dependsOn.status !== 'APPROVED');
                if (incompleteDeps.length > 0) {
                    const incompleteNames = incompleteDeps.map((dep: any) => dep.dependsOn.title).join(', ');
                    throw new Error(`Cannot ${status === 'IN_PROGRESS' ? 'start' : 'submit'} task: The following dependent tasks must be approved first: ${incompleteNames}`);
                }
            }
        }

        // For SUBMITTED status, ensure the user is the assignee
        if (status === 'SUBMITTED') {
            if (!userId) throw new Error('User ID is required to submit a task');
            if (task.assignedTo !== userId) throw new Error('You can only submit your own tasks');
            return await taskRepo.submitTask(id, userId);
        }

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

        // Check if all dependencies are completed (APPROVED)
        const dependencies = await taskDependencyRepo.getTaskDependencies(id);
        if (dependencies.length > 0) {
            const incompleteDeps = dependencies.filter((dep: any) => dep.dependsOn.status !== 'APPROVED');
            if (incompleteDeps.length > 0) {
                const incompleteNames = incompleteDeps.map((dep: any) => dep.dependsOn.title).join(', ');
                throw new Error(`Cannot submit: The following dependent tasks must be approved first: ${incompleteNames}`);
            }
        }

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
        return await taskRepo.getTasksByAssignee(userId);
    },
};
