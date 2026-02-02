import { userRepo } from '../repositories/user.repository';

export const userService = {
    getAllUsers: async () => {
        return await userRepo.getAllUsers();
    },

    getUserById: async (id: number) => {
        return await userRepo.getUserById(id);
    },

    createUser: async (name: string, role: string) => {
        return await userRepo.createUser(name, role);
    },

    getAllUsersWithStats: async () => {
        return await userRepo.getAllUsersWithStats();
    },

    getUsersWithStatsByRoomId: async (roomId: number) => {
        return await userRepo.getUsersWithStatsByRoomId(roomId);
    },
};
