import { Router } from 'express';
import { roomController } from '../controllers/room.controller';

const router = Router();

router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.post('/', roomController.createRoom);
router.put('/:id', roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);

export default router;
