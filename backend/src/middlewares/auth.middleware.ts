import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends Request {
    userId?: number;
    email?: string;
    userRole?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = (req as any).headers.authorization?.split(' ')[1];
        if (!token) {
            return (res as any).status(401).json({ error: 'No token provided' });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        req.email = decoded.email;
        req.userRole = decoded.role;
        (next as any)();
    } catch (error) {
        (res as any).status(401).json({ error: 'Invalid token' });
    }
};
