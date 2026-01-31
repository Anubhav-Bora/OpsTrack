import { prisma } from '../prisma';

export const userRepo = {
    // Get all users with their details
    getAllUsers: () =>
        prisma.user.findMany({
            include: {
                tasks: true,
                roomsCreated: true,
                roomMemberships: {
                    include: { room: true },
                },
            },
        }),

    // Get user by ID with details
    getUserById: (id: number) =>
        prisma.user.findUnique({
            where: { id },
            include: {
                tasks: true,
                roomsCreated: true,
                roomMemberships: {
                    include: { room: true },
                },
            },
        }),

    // Create a new user
    createUser: (name: string, role: string) =>
        prisma.user.create({
            data: { name, role: role as any },
        }),
};
