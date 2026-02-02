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
        prisma.$transaction(async (tx) => {
            console.log(`Repository: Starting transaction for room deletion ${id}`);
            
            // Get all task IDs in this room
            const tasksInRoom = await tx.task.findMany({
                where: { roomId: id },
                select: { id: true },
            });
            const taskIds = tasksInRoom.map(t => t.id);
            console.log(`Repository: Found ${taskIds.length} tasks in room ${id}`);

            // Delete all task dependencies where any side involves a task from this room
            if (taskIds.length > 0) {
                const deletedDependencies = await tx.taskDependency.deleteMany({
                    where: {
                        OR: [
                            { taskId: { in: taskIds } },
                            { dependsOnTaskId: { in: taskIds } },
                        ],
                    },
                });
                console.log(`Repository: Deleted ${deletedDependencies.count} task dependencies`);
            }

            // Delete tasks in the room
            const deletedTasks = await tx.task.deleteMany({
                where: { roomId: id },
            });
            console.log(`Repository: Deleted ${deletedTasks.count} tasks`);

            // Delete room members
            const deletedMembers = await tx.roomMember.deleteMany({
                where: { roomId: id },
            });
            console.log(`Repository: Deleted ${deletedMembers.count} room members`);

            // Delete the room
            const deletedRoom = await tx.room.delete({
                where: { id },
            });
            console.log(`Repository: Successfully deleted room ${id}`);
            return deletedRoom;
        }),
};
