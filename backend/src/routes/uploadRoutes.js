import { Router } from 'express';
import { uploadMiddleware } from '../config/multer.js';
import { handleFileUpload, handleUploadError } from '../controllers/uploadController.js';

const router = Router();

router.post('/upload', uploadMiddleware.single('file'), handleFileUpload, handleUploadError);

export default router;
