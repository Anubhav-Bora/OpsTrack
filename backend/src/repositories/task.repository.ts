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

    //delete task
    deleteTask: (id: number) =>
        prisma.task.delete({
            where: { id },
        }),

    //get tasks of a room
    taskRoom: (roomId: number) =>
        prisma.task.findMany({
            where: { roomId },
            include: { assignee: true, dependencies: true },
        })
}
