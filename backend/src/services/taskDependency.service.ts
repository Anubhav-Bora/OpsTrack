import { taskDependencyRepo } from '../repositories/taskDependency.repository';
import { taskRepo } from '../repositories/task.repository';

export const taskDependencyService = {
    getAllTaskDependencies: async () => {
        return await taskDependencyRepo.getAllTaskDependencies();
    },

    getTaskDependencies: async (taskId: number) => {
        return await taskDependencyRepo.getTaskDependencies(taskId);
    },

    getTaskDependents: async (dependsOnTaskId: number) => {
        return await taskDependencyRepo.getTaskDependents(dependsOnTaskId);
    },

    addTaskDependency: async (taskId: number, dependsOnTaskId: number) => {
        // Validate inputs
        if (!taskId || isNaN(taskId)) {
            throw new Error('Invalid taskId: must be a valid number');
        }
        if (!dependsOnTaskId || isNaN(dependsOnTaskId)) {
            throw new Error('Invalid dependsOnTaskId: must be a valid number');
        }
        if (taskId === dependsOnTaskId) {
            throw new Error('A task cannot depend on itself');
        }

        // Verify both tasks exist
        const task = await taskRepo.getTaskbyId(taskId);
        if (!task) {
            throw new Error(`Task with id ${taskId} not found`);
        }
        
        const dependsOnTask = await taskRepo.getTaskbyId(dependsOnTaskId);
        if (!dependsOnTask) {
            throw new Error(`Dependency task with id ${dependsOnTaskId} not found`);
        }

        return await taskDependencyRepo.addTaskDependency(taskId, dependsOnTaskId);
    },

    removeTaskDependency: async (taskId: number, dependsOnTaskId: number) => {
        return await taskDependencyRepo.removeTaskDependency(taskId, dependsOnTaskId);
    },
};
