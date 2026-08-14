import multer from 'multer';

export const handleFileUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided or file upload failed validation' });
  }

  // Construct absolute file URL accessible to both participants
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.json({
    name: req.file.originalname,
    filename: req.file.filename,
    url: fileUrl,
    size: `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`,
    mimetype: req.file.mimetype,
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
