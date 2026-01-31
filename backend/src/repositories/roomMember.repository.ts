import { prisma } from '../prisma';
import { RoomRole } from '@prisma/client';

export const roomMemberRepo = {
    // Get all room members
    getAllRoomMembers: () =>
        prisma.roomMember.findMany({
            include: {
                user: true,
                room: true,
            },
        }),

    // Get room members by room ID
    getRoomMembersByRoomId: (roomId: number) =>
        prisma.roomMember.findMany({
            where: { roomId },
            include: {
                user: true,
                room: true,
            },
        }),

    // Get user's room memberships
    getUserRoomMemberships: (userId: number) =>
        prisma.roomMember.findMany({
            where: { userId },
            include: {
                user: true,
                room: true,
            },
        }),

    // Add member to room
    addMemberToRoom: (userId: number, roomId: number, role: RoomRole = 'MEMBER') =>
        prisma.roomMember.create({
            data: { userId, roomId, role },
            include: { user: true, room: true },
        }),

    // Update member role
    updateMemberRole: (userId: number, roomId: number, role: RoomRole) =>
        prisma.roomMember.update({
            where: { userId_roomId: { userId, roomId } },
            data: { role },
        }),

    // Remove member from room
    removeMemberFromRoom: (userId: number, roomId: number) =>
        prisma.roomMember.delete({
            where: { userId_roomId: { userId, roomId } },
        }),
};
