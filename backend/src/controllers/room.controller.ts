import { Response } from 'express';
import { roomService } from '../services/room.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const roomController = {
    getAllRooms: async (req: AuthRequest, res: Response) => {
        try {
            const rooms = await roomService.getAllRooms();
            const transformedRooms = rooms.map(room => ({
                ...room,
                membersCount: room._count.members,
                tasksCount: room._count.tasks,
                completedTasksCount: room.tasks.filter(t => t.status === 'APPROVED').length,
            }));
            res.json(transformedRooms);
        } catch (error) {
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
            const room = await roomService.createRoom(name, description, req.userId!);
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
            await roomService.deleteRoom(Number(id));
            res.json({ message: 'Room deleted' });
        } catch (error) {
            res.status(400).json({ error: 'Failed to delete room' });
        }
    },
};
