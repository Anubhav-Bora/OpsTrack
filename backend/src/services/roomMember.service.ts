import { roomMemberRepo } from '../repositories/roomMember.repository';

type RoomRole = 'LEADER' | 'ADMIN' | 'MEMBER';

export const roomMemberService = {
    getAllRoomMembers: async () => {
        return await roomMemberRepo.getAllRoomMembers();
    },

    getRoomMembersByRoomId: async (roomId: number) => {
        return await roomMemberRepo.getRoomMembersByRoomId(roomId);
    },

    getUserRoomMemberships: async (userId: number) => {
        return await roomMemberRepo.getUserRoomMemberships(userId);
    },

    addMemberToRoom: async (userId: number, roomId: number, role?: RoomRole) => {
        return await roomMemberRepo.addMemberToRoom(userId, roomId, role);
    },

    updateMemberRole: async (userId: number, roomId: number, role: RoomRole) => {
        return await roomMemberRepo.updateMemberRole(userId, roomId, role);
    },

    removeMemberFromRoom: async (userId: number, roomId: number) => {
        return await roomMemberRepo.removeMemberFromRoom(userId, roomId);
    },
};
