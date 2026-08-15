import { Router } from 'express';
import { getHealthStatus, verifyHealthPassword, verifyHealthTotp, getTotpSetupInfo } from '../controllers/healthController.js';

const router = Router();

// Mounted at /api in index.js -> responds to GET /api/health, POST /api/health/verify-pass, POST /api/health/verify-totp
router.get('/health', getHealthStatus);
router.post('/health/verify-pass', verifyHealthPassword);
router.post('/health/verify-totp', verifyHealthTotp);
router.get('/health/totp-setup', getTotpSetupInfo);

export default router;
