import { prisma } from '../prisma'

type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'BLOCKED';
type UserRole = 'ADMIN' | 'BACKEND' | 'FRONTEND' | 'DEVOPS' | 'CYBERSECURITY';

export const taskRepo = {
    //create new task
    createTask: (title: string, description: string | undefined, requiredRole: UserRole, roomId: number, dueDate?: Date, assignedTo?: number) =>
        prisma.task.create({
            data: { title, description, requiredRole, roomId, dueDate, assignedTo },
            include: { assignee: true, room: true },
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

    //update task details
    updateTask: (id: number, title: string, description: string | undefined, requiredRole: UserRole, dueDate?: Date) =>
        prisma.task.update({
            where: { id },
            data: { title, description, requiredRole, dueDate },
            include: { assignee: true, dependencies: true, dependents: true, room: true },
        }),

    //assign task to user
    assignTask: (id: number, assignedTo: number) => {
        return prisma.task.update({
            where: { id },
            data: { assignedTo },
            include: { assignee: true, room: true, dependencies: true, dependents: true },
        });
    },

    //submit task for approval
    submitTask: (id: number, submittedBy: number) =>
        prisma.task.update({
            where: { id },
            data: {
                status: 'SUBMITTED',
                submittedAt: new Date(),
                submittedBy,
            },
        }),

    //approve task
    approveTask: (id: number, approvedBy: number) =>
        prisma.task.update({
            where: { id },
            data: {
                status: 'APPROVED',
                approvedAt: new Date(),
                approvedBy,
            },
        }),

    //reject task
    rejectTask: (id: number, rejectionNote?: string) =>
        prisma.task.update({
            where: { id },
            data: {
                status: 'REJECTED',
                rejectedAt: new Date(),
                rejectionNote,
            },
        }),

    //complete task
    completeTask: (id: number, completedBy: number) =>
        prisma.task.update({
            where: { id },
            data: {
                status: 'APPROVED' as TaskStatus,
                approvedAt: new Date(),
                approvedBy: completedBy,
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
            where: { roomId, status: 'APPROVED' as TaskStatus },
            include: { assignee: true },
        }),

    //get tasks assigned to user
    getTasksByAssignee: (userId: number) => {
        return prisma.task.findMany({
            where: { assignedTo: userId },
            include: { room: true, assignee: true, dependencies: true, dependents: true },
        });
    },
}
