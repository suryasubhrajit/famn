import { Router } from 'express';
import uploadRoutes from './uploadRoutes.js';
import captchaRoutes from './captchaRoutes.js';
import roomRoutes from './roomRoutes.js';
import userRoutes from './userRoutes.js';
import healthRoutes from './healthRoutes.js';

const router = Router();

router.use(uploadRoutes);
router.use(captchaRoutes);
router.use(roomRoutes);
router.use(userRoutes);
router.use(healthRoutes);

export default router;
