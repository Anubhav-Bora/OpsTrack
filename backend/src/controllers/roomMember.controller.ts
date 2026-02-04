import { Response } from 'express';
import { roomMemberService } from '../services/roomMember.service';
import { authorizationService } from '../services/authorization.service';
import { AuthRequest } from '../middlewares/auth.middleware';

// Type assertion helpers for Express 5.x compatibility
const getParams = (req: any) => req.params;
const getBody = (req: any) => req.body;

export const roomMemberController = {
    getAllRoomMembers: async (req: AuthRequest, res: Response) => {
        try {
            const members = await roomMemberService.getAllRoomMembers();
            return (res as any).json(members);
        } catch (error) {
            return (res as any).status(500).json({ error: 'Failed to fetch room members' });
        }
    },

    getRoomMembersByRoomId: async (req: AuthRequest, res: Response) => {
        try {
            const { roomId } = getParams(req);
            const members = await roomMemberService.getRoomMembersByRoomId(Number(roomId));
            return (res as any).json(members);
        } catch (error) {
            return (res as any).status(500).json({ error: 'Failed to fetch room members' });
        }
    },

    getUserRoomMemberships: async (req: AuthRequest, res: Response) => {
        try {
            const { userId } = getParams(req);
            const memberships = await roomMemberService.getUserRoomMemberships(Number(userId));
            return (res as any).json(memberships);
        } catch (error) {
            return (res as any).status(500).json({ error: 'Failed to fetch user memberships' });
        }
    },

    addMemberToRoom: async (req: AuthRequest, res: Response) => {
        try {
            const { userId, roomId, role } = getBody(req);
            const canPromote = await authorizationService.canPromoteMembers(Number(req.userId!), Number(roomId));
            if (!canPromote) {
                return (res as any).status(403).json({ error: 'You do not have permission to add members' });
            }
            const member = await roomMemberService.addMemberToRoom(Number(userId), Number(roomId), role);
            return (res as any).status(201).json(member);
        } catch (error: any) {
            return (res as any).status(400).json({ error: error.message });
        }
    },

    updateMemberRole: async (req: AuthRequest, res: Response) => {
        try {
            const { userId, roomId } = getParams(req);
            const { role } = getBody(req);
            const canPromote = await authorizationService.canPromoteMembers(Number(req.userId!), Number(roomId));
            if (!canPromote) {
                return (res as any).status(403).json({ error: 'You do not have permission to update member roles' });
            }
            const member = await roomMemberService.updateMemberRole(Number(userId), Number(roomId), role);
            return (res as any).json(member);
        } catch (error: any) {
            return (res as any).status(400).json({ error: error.message });
        }
    },

    removeMemberFromRoom: async (req: AuthRequest, res: Response) => {
        try {
            const { userId, roomId } = getParams(req);
            const canPromote = await authorizationService.canPromoteMembers(Number(req.userId!), Number(roomId));
            if (!canPromote) {
                return (res as any).status(403).json({ error: 'You do not have permission to remove members' });
            }
            await roomMemberService.removeMemberFromRoom(Number(userId), Number(roomId));
            return (res as any).json({ message: 'Member removed from room' });
        } catch (error: any) {
            return (res as any).status(400).json({ error: error.message });
        }
    },
};
