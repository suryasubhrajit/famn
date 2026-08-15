import { Router } from 'express';
import { getHealthStatus } from '../controllers/healthController.js';

const router = Router();

// Mounted at /api in index.js -> responds to GET /api/health
router.get('/health', getHealthStatus);

export default router;
