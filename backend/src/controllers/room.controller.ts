import { Response } from 'express';
import { roomService } from '../services/room.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const roomController = {
    getAllRooms: async (req: AuthRequest, res: Response) => {
        try {
            const userId = Number(req.userId!);
            const userRole = req.userRole!;
            console.log('[Room Controller] getAllRooms - userId:', userId, 'email:', req.email, 'userRole:', userRole);
            const rooms = await roomService.getAllRooms(userId, userRole);
            console.log('[Room Controller] Rooms found:', rooms.length);
            const transformedRooms = rooms.map(room => ({
                ...room,
                membersCount: room._count.members,
                tasksCount: room._count.tasks,
                completedTasksCount: room.tasks.filter(t => t.status === 'APPROVED').length,
            }));
            res.json(transformedRooms);
        } catch (error) {
            console.error('Get all rooms error:', error);
            res.status(500).json({ error: 'Failed to fetch rooms' });
        }
    },

    getRoomById: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const room = await roomService.getRoomById(Number(id));
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }
            res.json(room);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch room' });
        }
    },

    createRoom: async (req: AuthRequest, res: Response) => {
        try {
            const { name, description } = req.body;
            const room = await roomService.createRoom(name, description, Number(req.userId!));
            res.status(201).json(room);
        } catch (error) {
            res.status(400).json({ error: 'Failed to create room' });
        }
    },

    updateRoom: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const { name, description } = req.body;
            const room = await roomService.updateRoom(Number(id), name, description);
            res.json(room);
        } catch (error) {
            res.status(400).json({ error: 'Failed to update room' });
        }
    },

    deleteRoom: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const userId = Number(req.userId!);
            const userRole = req.userRole!;

            // Check if user is admin or room leader
            const canDelete = await roomService.canDeleteRoom(Number(id), userId, userRole);
            if (!canDelete) {
                return res.status(403).json({ error: 'You do not have permission to delete this room' });
            }

            const roomId = Number(id);
            console.log(`Attempting to delete room ${roomId}`);
            
            await roomService.deleteRoom(roomId);
            console.log(`Successfully deleted room ${roomId}`);
            res.json({ message: 'Room deleted' });
        } catch (error) {
            console.error('Delete room error:', error);
            const message = error instanceof Error ? error.message : 'Failed to delete room';
            console.error('Error details:', JSON.stringify(error, null, 2));
            res.status(400).json({ error: message });
        }
    },
};
