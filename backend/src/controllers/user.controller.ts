// User controller
import { Request, Response } from "express";
import { userService } from "../services/user.service";

export const userController = {
    //get all users
    getAllUsers: async (req: Request, res: Response) => {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    },
    //getbyUserId
    getUserById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(Number(id));
            res.json(user);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch user' });
        }
    },

    //create user
    createUser: async (req: Request, res: Response) => {
        try {
            const { name, role } = req.body;
            const user = await userService.createUser(name, role);
            res.status(201).json(user);
        }
        catch (error) {
            res.status(400).json({ error: 'Failed to create user' });
        }
    },
}