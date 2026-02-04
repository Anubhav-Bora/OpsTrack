import { Router, Request, Response, NextFunction } from 'express'
import { userController } from '../controllers/user.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router();

// Debug middleware to log which route is matched
const logRoute = (routeName: string) => (req: Request, res: Response, next: NextFunction) => {
    (next as any)();
};

// Test route (no auth required)
router.get('/test/all', logRoute('test/all'), userController.testGetUsers);

// Static routes MUST come before dynamic routes
router.get('/stats', logRoute('/stats'), authMiddleware, userController.getAllUsersWithStats);
router.get('/stats/room/:roomId', logRoute('/stats/room/:roomId'), authMiddleware, userController.getUsersWithStatsByRoomId);

// Dynamic routes (AFTER static routes)
router.get('/', logRoute('/'), authMiddleware, userController.getAllUsers);
router.post('/', logRoute('POST /'), authMiddleware, userController.createUser);
router.get('/:id', logRoute('/:id'), authMiddleware, userController.getUserById);

export default router;
