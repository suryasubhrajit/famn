import { Router } from 'express';
import { createRoom, verifyRoomExists, fetchRoomMessages } from '../controllers/roomController.js';

const router = Router();

router.post('/rooms/create', createRoom);
router.get('/rooms/:roomId/exists', verifyRoomExists);
router.get('/rooms/:roomId/messages', fetchRoomMessages);

export default router;
