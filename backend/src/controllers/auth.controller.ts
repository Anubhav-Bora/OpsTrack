import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { signupSchema, signinSchema } from '../utils/validators';

// Type assertion helpers for Express 5.x compatibility
const getBody = (req: any) => req.body;

export const authController = {
    signup: async (req: Request, res: Response) => {
        try {
            const validated = signupSchema.parse(getBody(req));
            const result = await authService.signup(validated.name, validated.email, validated.password, validated.role);
            return (res as any).status(201).json(result);
        } catch (error: any) {
            const message = error.message || 'Signup failed';
            return (res as any).status(400).json({ error: message });
        }
    },

    signin: async (req: Request, res: Response) => {
        try {
            const validated = signinSchema.parse(getBody(req));
            const result = await authService.signin(validated.email, validated.password);
            return (res as any).json(result);
        } catch (error: any) {
            const message = error.message || 'Signin failed';
            return (res as any).status(401).json({ error: message });
        }
    },
};
