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
        prisma.room.delete({
            where: { id },
        }),
};
