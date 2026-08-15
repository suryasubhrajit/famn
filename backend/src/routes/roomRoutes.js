import { Router } from 'express';
import { createRoom, verifyRoomExists, fetchRoomMessages, extendRoom } from '../controllers/roomController.js';

const router = Router();

router.post('/rooms/create', createRoom);
router.get('/rooms/:roomId/exists', verifyRoomExists);
router.get('/rooms/:roomId/messages', fetchRoomMessages);
router.post('/rooms/:roomId/extend', extendRoom);

export default router;
