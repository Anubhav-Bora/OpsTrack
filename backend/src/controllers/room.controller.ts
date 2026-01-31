import { Request, Response } from 'express';
import { roomService } from '../services/room.service';

export const roomController = {
    getAllRooms: async (req: Request, res: Response) => {
        try {
            const rooms = await roomService.getAllRooms();
            res.json(rooms);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch rooms' });
        }
    },

    getRoomById: async (req: Request, res: Response) => {
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

    createRoom: async (req: Request, res: Response) => {
        try {
            const { name, createdBy } = req.body;
            const room = await roomService.createRoom(name, createdBy);
            res.status(201).json(room);
        } catch (error) {
            res.status(400).json({ error: 'Failed to create room' });
        }
    },

    updateRoom: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const room = await roomService.updateRoom(Number(id), name);
            res.json(room);
        } catch (error) {
            res.status(400).json({ error: 'Failed to update room' });
        }
    },

    deleteRoom: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await roomService.deleteRoom(Number(id));
            res.json({ message: 'Room deleted' });
        } catch (error) {
            res.status(400).json({ error: 'Failed to delete room' });
        }
    },
};
