import { prisma } from '../prisma';

export const userRepo = {
    // Get all users with their details
    getAllUsers: () =>
        prisma.user.findMany({
            include: {
                tasks: true,
                roomsCreated: true,
            },
        }),

    // Get user by ID with details
    getUserById: (id: number) =>
        prisma.user.findUnique({
            where: { id },
            include: {
                tasks: true,
                roomsCreated: true,
            },
        }),

    // Create a new user
    createUser: (name: string, role: string) =>
        prisma.user.create({
            data: { name, role: role as any },
        }),

    // Get all users with task statistics (for admin)
    getAllUsersWithStats: async () => {
        try {
            // Get all users
            const users = await prisma.user.findMany();

            if (users.length === 0) {
                return [];
            }

            // For each user, get their tasks and room memberships
            const result = [];
            for (const user of users) {
                try {
                    // Get tasks assigned to this user
                    const tasks = await prisma.task.findMany({
                        where: { assignedTo: user.id },
                    });

                    // Get room memberships
                    const roomMemberships = await prisma.roomMember.findMany({
                        where: { userId: user.id },
                        include: {
                            room: {
                                select: { id: true, name: true }
                            }
                        }
                    });

                    // Calculate stats
                    const stats = {
                        totalTasks: tasks.length,
                        pendingTasks: tasks.filter((t: any) => t.status === 'PENDING').length,
                        inProgressTasks: tasks.filter((t: any) => t.status === 'IN_PROGRESS').length,
                        submittedTasks: tasks.filter((t: any) => t.status === 'SUBMITTED').length,
                        completedTasks: tasks.filter((t: any) => t.status === 'APPROVED').length,
                        rejectedTasks: tasks.filter((t: any) => t.status === 'REJECTED').length,
                    };

                    result.push({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        createdAt: user.createdAt,
                        stats,
                        rooms: roomMemberships.map((m: any) => ({
                            id: m.room.id,
                            name: m.room.name,
                            role: m.role,
                        })),
                    });
                } catch (userError) {
                    throw userError;
                }
            }

            return result;
        } catch (error) {
            throw error;
        }
    },

    // Get users with stats for a specific room (for leader)
    getUsersWithStatsByRoomId: async (roomId: number) => {
        try {
            const roomMembers = await prisma.roomMember.findMany({
                where: { roomId },
                include: {
                    user: true,
                },
            });

            const result = [];
            for (const member of roomMembers) {
                try {
                    const tasks = await prisma.task.findMany({
                        where: {
                            assignedTo: member.userId,
                            roomId
                        },
                    });

                    const stats = {
                        totalTasks: tasks.length,
                        pendingTasks: tasks.filter((t: any) => t.status === 'PENDING').length,
                        inProgressTasks: tasks.filter((t: any) => t.status === 'IN_PROGRESS').length,
                        submittedTasks: tasks.filter((t: any) => t.status === 'SUBMITTED').length,
                        completedTasks: tasks.filter((t: any) => t.status === 'APPROVED').length,
                        rejectedTasks: tasks.filter((t: any) => t.status === 'REJECTED').length,
                    };

                    result.push({
                        id: member.user.id,
                        name: member.user.name,
                        email: member.user.email,
                        role: member.user.role,
                        roomRole: member.role,
                        createdAt: member.user.createdAt,
                        stats,
                    });
                } catch (memberError) {
                    throw memberError;
                }
            }

            return result;
        } catch (error) {
            throw error;
        }
    },
};
