import { prisma } from '../prisma';

export const roomRepo = {
    // Get all rooms with details
    getAllRooms: () =>
        prisma.room.findMany({
            include: {
                creator: true,
                members: {
                    include: { user: true },
                },
                tasks: true,
                _count: {
                    select: {
                        members: true,
                        tasks: true
                    }
                }
            },
        }),

    // Get room by ID with details
    getRoomById: (id: number) =>
        prisma.room.findUnique({
            where: { id },
            include: {
                creator: true,
                members: {
                    include: { user: true },
                },
                tasks: true,
            },
        }),

    // Create a new room
    createRoom: (name: string, description: string | undefined, createdBy: number) =>
        prisma.room.create({
            data: { name, description, createdBy },
            include: { creator: true },
        }),

    // Update room
    updateRoom: (id: number, name: string, description?: string) =>
        prisma.room.update({
            where: { id },
            data: { name, ...(description !== undefined && { description }) },
        }),

    // Delete room
    deleteRoom: (id: number) =>
        prisma.$transaction(async (tx: any) => {
            // Get all task IDs in this room
            const tasksInRoom = await tx.task.findMany({
                where: { roomId: id },
                select: { id: true },
            });
            const taskIds = tasksInRoom.map((t: any) => t.id);

            // Delete all task dependencies where any side involves a task from this room
            if (taskIds.length > 0) {
                await tx.taskDependency.deleteMany({
                    where: {
                        OR: [
                            { taskId: { in: taskIds } },
                            { dependsOnTaskId: { in: taskIds } },
                        ],
                    },
                });
            }

            // Delete tasks in the room
            await tx.task.deleteMany({
                where: { roomId: id },
            });

            // Delete room members
            await tx.roomMember.deleteMany({
                where: { roomId: id },
            });

            // Delete the room
            return await tx.room.delete({
                where: { id },
            });
        }),
};
