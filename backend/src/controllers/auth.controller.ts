import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { signupSchema, signinSchema } from '../utils/validators';

export const authController = {
    signup: async (req: Request, res: Response) => {
        try {
            const validated = signupSchema.parse(req.body);
            const result = await authService.signup(validated.name, validated.email, validated.password, validated.role);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },

    signin: async (req: Request, res: Response) => {
        try {
            const validated = signinSchema.parse(req.body);
            const result = await authService.signin(validated.email, validated.password);
            res.json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    },
};
