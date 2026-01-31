import { Router } from 'express'
import { userController } from '../controllers/user.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router();

router.get('/', authMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.post('/', authMiddleware, userController.createUser);
export default router;