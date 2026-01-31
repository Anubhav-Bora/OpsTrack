import { Request, Response } from 'express';
import { roomMemberService } from '../services/roomMember.service';

export const roomMemberController = {
    getAllRoomMembers: async (req: Request, res: Response) => {
        try {
            const members = await roomMemberService.getAllRoomMembers();
            res.json(members);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch room members' });
        }
    },

    getRoomMembersByRoomId: async (req: Request, res: Response) => {
        try {
            const { roomId } = req.params;
            const members = await roomMemberService.getRoomMembersByRoomId(Number(roomId));
            res.json(members);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch room members' });
        }
    },

    getUserRoomMemberships: async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const memberships = await roomMemberService.getUserRoomMemberships(Number(userId));
            res.json(memberships);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch user memberships' });
        }
    },

    addMemberToRoom: async (req: Request, res: Response) => {
        try {
            const { userId, roomId, role } = req.body;
            const member = await roomMemberService.addMemberToRoom(userId, roomId, role);
            res.status(201).json(member);
        } catch (error) {
            res.status(400).json({ error: 'Failed to add member to room' });
        }
    },

    updateMemberRole: async (req: Request, res: Response) => {
        try {
            const { userId, roomId } = req.params;
            const { role } = req.body;
            const member = await roomMemberService.updateMemberRole(Number(userId), Number(roomId), role);
            res.json(member);
        } catch (error) {
            res.status(400).json({ error: 'Failed to update member role' });
        }
    },

    removeMemberFromRoom: async (req: Request, res: Response) => {
        try {
            const { userId, roomId } = req.params;
            await roomMemberService.removeMemberFromRoom(Number(userId), Number(roomId));
            res.json({ message: 'Member removed from room' });
        } catch (error) {
            res.status(400).json({ error: 'Failed to remove member from room' });
        }
    },
};
