import { taskDependencyRepo } from '../repositories/taskDependency.repository';

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
        return await taskDependencyRepo.addTaskDependency(taskId, dependsOnTaskId);
    },

    removeTaskDependency: async (taskId: number, dependsOnTaskId: number) => {
        return await taskDependencyRepo.removeTaskDependency(taskId, dependsOnTaskId);
    },
};
