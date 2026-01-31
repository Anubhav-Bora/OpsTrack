import express from 'express';
import userRoutes from './routes/user.routes';
import taskRoutes from './routes/task.routes';
import roomRoutes from './routes/room.routes';
import roomMemberRoutes from './routes/roomMember.routes';
import taskDependencyRoutes from './routes/taskDependency.routes';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/room-members', roomMemberRoutes);
app.use('/api/task-dependencies', taskDependencyRoutes);

export default app;
