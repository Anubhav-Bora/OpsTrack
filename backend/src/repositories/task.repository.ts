import { prisma } from '../prisma'
import { TaskStatus, UserRole } from '@prisma/client'

export const taskRepo = {
    //create new task
    createTask: (title: string, requiredRole: UserRole, roomId: number) =>
        prisma.task.create({
            data: { title, requiredRole, roomId },
        }),

    //get all tasks
    getAllTasks: () =>
        prisma.task.findMany({
            include: { dependencies: true, dependents: true, assignee: true, room: true },
        }),

    //get task by id
    getTaskbyId: (id: number) =>
        prisma.task.findUnique({
            where: { id },
            include: { dependencies: true, dependents: true, assignee: true, room: true },
        }),

    //update task status
    updateTaskStatus: (id: number, status: TaskStatus) =>
        prisma.task.update({
            where: { id },
            data: { status },
        }),

    //assign task to user
    assignTask: (id: number, assignedTo: number) =>
        prisma.task.update({
            where: { id },
            data: { assignedTo },
        }),

    //complete task
    completeTask: (id: number, completedBy: number) =>
        prisma.task.update({
            where: { id },
            data: {
                status: 'DONE' as TaskStatus,
                completedAt: new Date(),
                completedBy,
            },
        }),

    //delete task
    deleteTask: (id: number) =>
        prisma.task.delete({
            where: { id },
        }),

    //get tasks by room
    getTasksByRoom: (roomId: number) =>
        prisma.task.findMany({
            where: { roomId },
            include: { assignee: true, dependencies: true },
        }),

    //get completed tasks with completion info
    getCompletedTasks: (roomId: number) =>
        prisma.task.findMany({
            where: { roomId, status: 'DONE' as TaskStatus },
            include: { assignee: true },
        }),

    //get tasks assigned to user
    getTasksByAssignee: (userId: number) =>
        prisma.task.findMany({
            where: { assignedTo: userId },
            include: { room: true, dependencies: true },
        }),
}
