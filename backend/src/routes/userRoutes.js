import { Router } from 'express';
import { getRandomHandle } from '../controllers/userController.js';

const router = Router();

router.get('/users/random-handle', getRandomHandle);

export default router;
