import { Response } from 'express';
import { roomService } from '../services/room.service';
import { AuthRequest } from '../middlewares/auth.middleware';

// Type assertion helpers for Express 5.x compatibility
const getParams = (req: any) => req.params;
const getBody = (req: any) => req.body;

export const roomController = {
    getAllRooms: async (req: AuthRequest, res: Response) => {
        try {
            const userId = Number(req.userId!);
            const userRole = req.userRole!;
            const rooms = await roomService.getAllRooms(userId, userRole);
            const transformedRooms = rooms.map((room: any) => ({
                ...room,
                membersCount: room._count.members,
                tasksCount: room._count.tasks,
                completedTasksCount: room.tasks.filter((t: any) => t.status === 'APPROVED').length,
            }));
            return (res as any).json(transformedRooms);
        } catch (error) {
            return (res as any).status(500).json({ error: 'Failed to fetch rooms' });
        }
    },

    getRoomById: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = getParams(req);
            const room = await roomService.getRoomById(Number(id));
            if (!room) {
                return (res as any).status(404).json({ error: 'Room not found' });
            }
            return (res as any).json(room);
        } catch (error) {
            return (res as any).status(500).json({ error: 'Failed to fetch room' });
        }
    },

    createRoom: async (req: AuthRequest, res: Response) => {
        try {
            const { name, description } = getBody(req);
            const room = await roomService.createRoom(name, description, Number(req.userId!));
            return (res as any).status(201).json(room);
        } catch (error) {
            return (res as any).status(400).json({ error: 'Failed to create room' });
        }
    },

    updateRoom: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = getParams(req);
            const { name, description } = getBody(req);
            const room = await roomService.updateRoom(Number(id), name, description);
            return (res as any).json(room);
        } catch (error) {
            return (res as any).status(400).json({ error: 'Failed to update room' });
        }
    },

    deleteRoom: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = getParams(req);
            const userId = Number(req.userId!);
            const userRole = req.userRole!;

            // Check if user is admin or room leader
            const canDelete = await roomService.canDeleteRoom(Number(id), userId, userRole);
            if (!canDelete) {
                return (res as any).status(403).json({ error: 'You do not have permission to delete this room' });
            }

            const roomId = Number(id);
            await roomService.deleteRoom(roomId);
            return (res as any).json({ message: 'Room deleted' });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to delete room';
            return (res as any).status(400).json({ error: message });
        }
    },
};
