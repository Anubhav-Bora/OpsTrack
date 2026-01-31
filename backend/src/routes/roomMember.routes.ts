import { Router } from 'express';
import { roomMemberController } from '../controllers/roomMember.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, roomMemberController.getAllRoomMembers);
router.get('/room/:roomId', authMiddleware, roomMemberController.getRoomMembersByRoomId);
router.get('/user/:userId', authMiddleware, roomMemberController.getUserRoomMemberships);
router.post('/', authMiddleware, roomMemberController.addMemberToRoom);
router.put('/:userId/:roomId', authMiddleware, roomMemberController.updateMemberRole);
router.delete('/:userId/:roomId', authMiddleware, roomMemberController.removeMemberFromRoom);

export default router;
