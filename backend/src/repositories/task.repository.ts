// Task repository
import { title } from 'node:process'
import { prisma } from '../prisma'
import { TaskStatus, UserRole } from '@prisma/client'

export const taskRepo = {
    //creat new task
    createTask: (title: string, requiredRole: UserRole, roomId: number) =>
        prisma.task.create({
            data: { title, requiredRole, roomId },
        }),

    //getall details of a task
    getTaskById: (id: number) =>
        prisma.task.findUnique({
            where: { id },
            include: { dependencies: true, dependents: true, assignee: true, room: true },
        }),

    // Assign a task to a user
    assignTask: (taskId: number, userId: number) =>
        prisma.task.update({
            where: { id: taskId },
            data: { assignedTo: userId, status: TaskStatus.IN_PROGRESS },
        }),

    //getTask of a room
    taskRoom: (roomId: number) =>
        prisma.task.findMany({
            where: { roomId },
            include: { assignee: true, dependencies: true },
        })
}
