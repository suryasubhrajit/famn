import { Router } from 'express';
import { uploadMiddleware } from '../config/multer.js';
import { handleFileUpload, handleFileDownload, handleUploadError } from '../controllers/uploadController.js';

const router = Router();

router.post('/upload', uploadMiddleware.single('file'), handleFileUpload, handleUploadError);
router.get('/download/:filename', handleFileDownload);
router.get('/download', handleFileDownload);

export default router;
