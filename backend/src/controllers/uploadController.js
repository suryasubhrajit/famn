import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { UPLOADS_DIR } from '../config/multer.js';

export const handleFileUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided or file upload failed validation' });
  }

  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const fileUrl = `${protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.json({
    name: req.file.originalname,
    filename: req.file.filename,
    url: fileUrl,
    size: `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`,
    mimetype: req.file.mimetype,
  });
};

export const handleFileDownload = (req, res) => {
  const filename = req.params.filename || req.query.filename;
  const originalName = req.query.name || filename;

  if (!filename) {
    return res.status(400).json({ error: 'Filename is required' });
  }

  // Prevent path traversal attacks
  const safeFilename = path.basename(filename);
  const filePath = path.join(UPLOADS_DIR, safeFilename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found or has auto-expired' });
  }

  // Set headers to force in-browser download
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
  res.download(filePath, originalName, (err) => {
    if (err && !res.headersSent) {
      res.status(500).json({ error: 'Download failed' });
    }
  });
};

// Express Error Handling Middleware for Multer Validation & Size Limits
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds maximum allowed limit of 10 MB.' });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};
