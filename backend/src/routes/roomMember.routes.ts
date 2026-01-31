import { Router } from 'express';
import { roomMemberController } from '../controllers/roomMember.controller';

const router = Router();

router.get('/', roomMemberController.getAllRoomMembers);
router.get('/room/:roomId', roomMemberController.getRoomMembersByRoomId);
router.get('/user/:userId', roomMemberController.getUserRoomMemberships);
router.post('/', roomMemberController.addMemberToRoom);
router.put('/:userId/:roomId', roomMemberController.updateMemberRole);
router.delete('/:userId/:roomId', roomMemberController.removeMemberFromRoom);

export default router;
