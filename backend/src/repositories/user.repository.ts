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

    // Get all users with task statistics (for admin)
    getAllUsersWithStats: async () => {
        const users = await prisma.user.findMany({
            include: {
                tasks: {
                    select: {
                        id: true,
                        status: true,
                    },
                },
                roomMemberships: {
                    include: {
                        room: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        return users.map(user => ({
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            stats: {
                totalTasks: user.tasks.length,
                pendingTasks: user.tasks.filter(t => t.status === 'PENDING').length,
                inProgressTasks: user.tasks.filter(t => t.status === 'IN_PROGRESS').length,
                submittedTasks: user.tasks.filter(t => t.status === 'SUBMITTED').length,
                completedTasks: user.tasks.filter(t => t.status === 'APPROVED').length,
                rejectedTasks: user.tasks.filter(t => t.status === 'REJECTED').length,
            },
            rooms: user.roomMemberships.map(m => ({
                id: m.room.id.toString(),
                name: m.room.name,
                role: m.role,
            })),
        }));
    },

    // Get users with stats for a specific room (for leader)
    getUsersWithStatsByRoomId: async (roomId: number) => {
        const roomMembers = await prisma.roomMember.findMany({
            where: { roomId },
            include: {
                user: {
                    include: {
                        tasks: {
                            where: { roomId },
                            select: {
                                id: true,
                                status: true,
                            },
                        },
                    },
                },
            },
        });

        return roomMembers.map(member => ({
            id: member.user.id.toString(),
            name: member.user.name,
            email: member.user.email,
            role: member.user.role,
            roomRole: member.role,
            createdAt: member.user.createdAt,
            stats: {
                totalTasks: member.user.tasks.length,
                pendingTasks: member.user.tasks.filter(t => t.status === 'PENDING').length,
                inProgressTasks: member.user.tasks.filter(t => t.status === 'IN_PROGRESS').length,
                submittedTasks: member.user.tasks.filter(t => t.status === 'SUBMITTED').length,
                completedTasks: member.user.tasks.filter(t => t.status === 'APPROVED').length,
                rejectedTasks: member.user.tasks.filter(t => t.status === 'REJECTED').length,
            },
        }));
    },
};
