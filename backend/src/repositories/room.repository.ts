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
    createRoom: (name: string, createdBy: number) =>
        prisma.room.create({
            data: { name, createdBy },
            include: { creator: true },
        }),

    // Update room
    updateRoom: (id: number, name: string) =>
        prisma.room.update({
            where: { id },
            data: { name },
        }),

    // Delete room
    deleteRoom: (id: number) =>
        prisma.room.delete({
            where: { id },
        }),
};
