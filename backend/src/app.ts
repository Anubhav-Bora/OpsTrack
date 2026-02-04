import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import taskRoutes from './routes/task.routes';
import roomRoutes from './routes/room.routes';
import roomMemberRoutes from './routes/roomMember.routes';
import taskDependencyRoutes from './routes/taskDependency.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

// Middleware
app.use(express.json());

// Manual CORS headers for Vercel serverless compatibility
app.use((req: any, res: any, next: any) => {
    const origin = req.headers.origin;

    // Allow all Vercel deployments and localhost
    if (origin && (
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
    )) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }

    next();
});

// Routes
app.get('/api/health', (req: any, res: any) => {
    res.json({ status: 'OK', message: 'Backend is running' });
});

app.get('/api', (req: any, res: any) => {
    res.json({ status: 'OK', message: 'OpsTrack API is running', version: '1.0.0' });
});

// Root route for base path
app.get('/', (req: any, res: any) => {
    res.json({ status: 'OK', message: 'OpsTrack API is running', version: '1.0.0', endpoints: '/api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/room-members', roomMemberRoutes);
app.use('/api/task-dependencies', taskDependencyRoutes);

// 404 handler for undefined routes
app.use((req: any, res: any) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`,
        availableEndpoints: ['/api', '/api/health', '/api/auth', '/api/users', '/api/tasks', '/api/rooms', '/api/room-members', '/api/task-dependencies']
    });
});

// Error handling middleware
app.use(errorMiddleware);

export default app;
