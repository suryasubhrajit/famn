import { Router } from 'express';
import { getHealthStatus, verifyHealthPassword } from '../controllers/healthController.js';

const router = Router();

// Mounted at /api in index.js -> responds to GET /api/health and POST /api/health/verify-pass
router.get('/health', getHealthStatus);
router.post('/health/verify-pass', verifyHealthPassword);

export default router;
