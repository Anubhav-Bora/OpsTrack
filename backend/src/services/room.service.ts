import { roomRepo } from '../repositories/room.repository';

export const roomService = {
    getAllRooms: async () => {
        return await roomRepo.getAllRooms();
    },

    getRoomById: async (id: number) => {
        return await roomRepo.getRoomById(id);
    },

    createRoom: async (name: string, createdBy: number) => {
        return await roomRepo.createRoom(name, createdBy);
    },

    updateRoom: async (id: number, name: string) => {
        return await roomRepo.updateRoom(id, name);
    },

    deleteRoom: async (id: number) => {
        return await roomRepo.deleteRoom(id);
    },
};
