import { Router } from 'express';
import { getHealthStatus, renderHealthDashboard } from '../controllers/healthController.js';

const router = Router();

router.get('/health', renderHealthDashboard);
router.get('/status', renderHealthDashboard);
router.get('/api/health', getHealthStatus);

export default router;
