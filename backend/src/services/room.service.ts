import { roomRepo } from '../repositories/room.repository';
import { prisma } from '../prisma';

export const roomService = {
    getAllRooms: async (userId: number, userRole: string) => {
        // Global admins see all rooms
        if (userRole === 'ADMIN') {
            return await roomRepo.getAllRooms();
        }

        // Non-admins see only rooms they're members of
        const rooms = await prisma.room.findMany({
            where: {
                members: {
                    some: {
                        userId: userId,
                    },
                },
            },
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
        });
        return rooms;
    },

    getRoomById: async (id: number) => {
        return await roomRepo.getRoomById(id);
    },

    createRoom: async (name: string, description: string | undefined, createdBy: number) => {
        return await roomRepo.createRoom(name, description, createdBy);
    },

    updateRoom: async (id: number, name: string, description?: string) => {
        return await roomRepo.updateRoom(id, name, description);
    },

    canDeleteRoom: async (roomId: number, userId: number, userRole: string) => {
        // Global admins can delete any room
        if (userRole === 'ADMIN') {
            return true;
        }

        // Check if user is a leader in this room
        const member = await prisma.roomMember.findUnique({
            where: {
                userId_roomId: {
                    userId,
                    roomId,
                },
            },
        });

        return member?.role === 'ADMIN' || member?.role === 'LEADER';
    },

    deleteRoom: async (id: number) => {
        return await roomRepo.deleteRoom(id);
    },
};
