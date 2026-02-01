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
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/room-members', roomMemberRoutes);
app.use('/api/task-dependencies', taskDependencyRoutes);

// Error handling middleware
app.use(errorMiddleware);

export default app;
