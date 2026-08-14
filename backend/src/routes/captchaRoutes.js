import { Router } from 'express';
import { verifyCaptcha } from '../controllers/captchaController.js';

const router = Router();

router.post('/captcha-verify', verifyCaptcha);

export default router;
