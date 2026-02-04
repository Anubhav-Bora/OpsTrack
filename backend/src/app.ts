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

// CORS configuration
const allowedOrigins = process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174']
    : ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Routes
app.get('/api/health', (req: any, res: any) => {
    res.json({ status: 'OK', message: 'Backend is running' });
});

app.get('/api', (req: any, res: any) => {
    res.json({ status: 'OK', message: 'OpsTrack API is running', version: '1.0.0' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/room-members', roomMemberRoutes);
app.use('/api/task-dependencies', taskDependencyRoutes);

// Error handling middleware
app.use(errorMiddleware);

export default app;
