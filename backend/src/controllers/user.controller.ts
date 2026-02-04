import { Response } from "express";
import { userService } from "../services/user.service";
import { authorizationService } from "../services/authorization.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { prisma } from "../prisma";

// Type assertion helpers for Express 5.x compatibility
const getParams = (req: any) => req.params;
const getBody = (req: any) => req.body;

export const userController = {
    // Test endpoint to check if users exist (no auth required)
    testGetUsers: async (_req: any, res: any) => {
        try {
            const users = await prisma.user.findMany();
            res.json({ count: users.length, users: users.map((u: any) => ({ id: u.id, name: u.name, role: u.role })) });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },

    //get all users
    getAllUsers: async (req: AuthRequest, res: Response) => {
        try {
            const users = await userService.getAllUsers();
            return (res as any).json(users);
        }
        catch (error) {
            return (res as any).status(500).json({ error: 'Failed to fetch users' });
        }
    },
    //getbyUserId
    getUserById: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = getParams(req);
            const numId = Number(id);

            // Validate that id is a valid number
            if (isNaN(numId) || numId <= 0) {
                return (res as any).status(400).json({ error: 'Invalid user ID' });
            }

            const user = await userService.getUserById(numId);
            if (!user) {
                return (res as any).status(404).json({ error: 'User not found' });
            }
            return (res as any).json(user);
        }
        catch (error: any) {
            return (res as any).status(500).json({ error: 'Failed to fetch user' });
        }
    },

    //create user
    createUser: async (req: AuthRequest, res: Response) => {
        try {
            const { name, role } = getBody(req);
            const user = await userService.createUser(name, role);
            return (res as any).status(201).json(user);
        }
        catch (error) {
            return (res as any).status(400).json({ error: 'Failed to create user' });
        }
    },

    // Get all users with stats (for admin only)
    getAllUsersWithStats: async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId;

            if (!userId) {
                return (res as any).status(401).json({ error: 'Unauthorized - no userId' });
            }

            const users = await userService.getAllUsersWithStats();
            return (res as any).json(users);
        }
        catch (error: any) {
            return (res as any).status(500).json({
                error: 'Failed to fetch users with stats',
                message: error.message,
            });
        }
    },

    // Get users with stats for a specific room (for leader/admin of that room)
    getUsersWithStatsByRoomId: async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId;
            const { roomId } = getParams(req);
            const roomIdNum = Number(roomId);

            if (!userId) {
                return (res as any).status(401).json({ error: 'Unauthorized' });
            }

            // Check if user is global admin or room leader/admin
            const isGlobalAdmin = await authorizationService.isGlobalAdmin(userId);
            const isRoomAdmin = await authorizationService.isRoomAdmin(userId, roomIdNum);

            if (!isGlobalAdmin && !isRoomAdmin) {
                return (res as any).status(403).json({ error: 'You do not have permission to view this room\'s users' });
            }

            const users = await userService.getUsersWithStatsByRoomId(roomIdNum);
            return (res as any).json(users);
        }
        catch (error: any) {
            return (res as any).status(500).json({ error: error.message || 'Failed to fetch room users with stats' });
        }
    },
}
