import { Router } from 'express';
import { roomController } from '../controllers/room.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, roomController.getAllRooms);
router.get('/:id', authMiddleware, roomController.getRoomById);
router.post('/', authMiddleware, roomController.createRoom);
router.put('/:id', authMiddleware, roomController.updateRoom);
router.delete('/:id', authMiddleware, roomController.deleteRoom);

export default router;
