import { roomRepo } from '../repositories/room.repository';

export const roomService = {
    getAllRooms: async () => {
        return await roomRepo.getAllRooms();
    },

    getRoomById: async (id: number) => {
        return await roomRepo.getRoomById(id);
    },

    createRoom: async (name: string, description: string | undefined, createdBy: number) => {
        return await roomRepo.createRoom(name, description, createdBy);
    },

    updateRoom: async (id: number, name: string, description?: string) => {
        return await roomRepo.updateRoom(id, name, description);
    },

    deleteRoom: async (id: number) => {
        return await roomRepo.deleteRoom(id);
    },
};
