import { prisma } from '../prisma';

export const authorizationService = {
    // Check if user is admin of a room
    isRoomAdmin: async (userId: number, roomId: number) => {
        const member = await prisma.roomMember.findUnique({
            where: { userId_roomId: { userId, roomId } },
        });
        return member?.role === 'ADMIN' || member?.role === 'LEADER';
    },

    // Check if user is member of a room
    isRoomMember: async (userId: number, roomId: number) => {
        const member = await prisma.roomMember.findUnique({
            where: { userId_roomId: { userId, roomId } },
        });
        return !!member;
    },

    // Check if user is global admin
    isGlobalAdmin: async (userId: number) => {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        return user?.role === 'ADMIN';
    },

    // Check if user can assign tasks in a room
    canAssignTasks: async (userId: number, roomId: number) => {
        const isAdmin = await authorizationService.isRoomAdmin(userId, roomId);
        const isGlobalAdmin = await authorizationService.isGlobalAdmin(userId);
        return isAdmin || isGlobalAdmin;
    },

    // Check if user can promote members in a room
    canPromoteMembers: async (userId: number, roomId: number) => {
        const isAdmin = await authorizationService.isRoomAdmin(userId, roomId);
        const isGlobalAdmin = await authorizationService.isGlobalAdmin(userId);
        return isAdmin || isGlobalAdmin;
    },
};
