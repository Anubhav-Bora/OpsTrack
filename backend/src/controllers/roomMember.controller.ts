import { Response } from 'express';
import { roomMemberService } from '../services/roomMember.service';
import { authorizationService } from '../services/authorization.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const roomMemberController = {
    getAllRoomMembers: async (req: AuthRequest, res: Response) => {
        try {
            const members = await roomMemberService.getAllRoomMembers();
            res.json(members);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch room members' });
        }
    },

    getRoomMembersByRoomId: async (req: AuthRequest, res: Response) => {
        try {
            const { roomId } = req.params;
            const members = await roomMemberService.getRoomMembersByRoomId(Number(roomId));
            res.json(members);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch room members' });
        }
    },

    getUserRoomMemberships: async (req: AuthRequest, res: Response) => {
        try {
            const { userId } = req.params;
            const memberships = await roomMemberService.getUserRoomMemberships(Number(userId));
            res.json(memberships);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch user memberships' });
        }
    },

    addMemberToRoom: async (req: AuthRequest, res: Response) => {
        try {
            const { userId, roomId, role } = req.body;
            const canPromote = await authorizationService.canPromoteMembers(req.userId!, Number(roomId));
            if (!canPromote) {
                return res.status(403).json({ error: 'You do not have permission to add members' });
            }
            const member = await roomMemberService.addMemberToRoom(Number(userId), Number(roomId), role);
            res.status(201).json(member);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },

    updateMemberRole: async (req: AuthRequest, res: Response) => {
        try {
            const { userId, roomId } = req.params;
            const { role } = req.body;
            const canPromote = await authorizationService.canPromoteMembers(req.userId!, Number(roomId));
            if (!canPromote) {
                return res.status(403).json({ error: 'You do not have permission to update member roles' });
            }
            const member = await roomMemberService.updateMemberRole(Number(userId), Number(roomId), role);
            res.json(member);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },

    removeMemberFromRoom: async (req: AuthRequest, res: Response) => {
        try {
            const { userId, roomId } = req.params;
            const canPromote = await authorizationService.canPromoteMembers(req.userId!, Number(roomId));
            if (!canPromote) {
                return res.status(403).json({ error: 'You do not have permission to remove members' });
            }
            await roomMemberService.removeMemberFromRoom(Number(userId), Number(roomId));
            res.json({ message: 'Member removed from room' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },
};
