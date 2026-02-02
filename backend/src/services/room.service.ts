import { roomRepo } from '../repositories/room.repository';
import { prisma } from '../prisma';

export const roomService = {
    getAllRooms: async (userId: number, userRole: string) => {
        console.log('[Room Service] getAllRooms - userId:', userId, 'type:', typeof userId, 'userRole:', userRole);
        // Global admins see all rooms
        if (userRole === 'ADMIN') {
            console.log('[Room Service] User is ADMIN, returning all rooms');
            return await roomRepo.getAllRooms();
        }

        // Non-admins see only rooms they're members of
        console.log('[Room Service] Non-admin user, querying rooms where user is member');
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
        console.log('[Room Service] Found', rooms.length, 'rooms for user', userId);
        if (rooms.length === 0) {
            console.log('[Room Service] No rooms found. Checking all room members:');
            const allMembers = await prisma.roomMember.findMany({ include: { user: true, room: true } });
            allMembers.forEach(m => {
                console.log(`  - Room: ${m.room.name}, User: ${m.user.name} (ID: ${m.userId})`);
            });
        }
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
        console.log(`Service: Starting deletion of room ${id}`);
        return await roomRepo.deleteRoom(id);
    },
};
