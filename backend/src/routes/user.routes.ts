import { Router } from 'express'
import { userController } from '../controllers/user.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router();

// Static routes MUST come before dynamic routes
router.get('/stats', authMiddleware, userController.getAllUsersWithStats);
router.get('/stats/room/:roomId', authMiddleware, userController.getUsersWithStatsByRoomId);

// Dynamic routes
router.get('/', authMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.post('/', authMiddleware, userController.createUser);

export default router;