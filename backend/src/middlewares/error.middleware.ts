import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    (res as any).status(err.status || 500).json({
        error: err.message || 'Internal server error',
    });
};
