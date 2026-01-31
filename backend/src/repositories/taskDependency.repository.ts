import { prisma } from '../prisma';

export const taskDependencyRepo = {
    // Get all task dependencies
    getAllTaskDependencies: () =>
        prisma.taskDependency.findMany({
            include: {
                task: true,
                dependsOn: true,
            },
        }),

    // Get dependencies for a task
    getTaskDependencies: (taskId: number) =>
        prisma.taskDependency.findMany({
            where: { taskId },
            include: {
                task: true,
                dependsOn: true,
            },
        }),

    // Get tasks that depend on a task
    getTaskDependents: (dependsOnTaskId: number) =>
        prisma.taskDependency.findMany({
            where: { dependsOnTaskId },
            include: {
                task: true,
                dependsOn: true,
            },
        }),

    // Add task dependency
    addTaskDependency: (taskId: number, dependsOnTaskId: number) =>
        prisma.taskDependency.create({
            data: { taskId, dependsOnTaskId },
            include: { task: true, dependsOn: true },
        }),

    // Remove task dependency
    removeTaskDependency: (taskId: number, dependsOnTaskId: number) =>
        prisma.taskDependency.delete({
            where: { taskId_dependsOnTaskId: { taskId, dependsOnTaskId } },
        }),
};
