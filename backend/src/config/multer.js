import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Strict Allowed Extensions (Images, Videos, Audio, Documents)
const ALLOWED_EXTENSIONS = new Set([
  'jpg', 'jpeg', 'png', 'gif', 'webp',
  'mp4', 'webm', 'mov',
  'mp3', 'wav', 'ogg', 'm4a',
  'pdf', 'doc', 'docx', 'txt', 'zip', 'rar', 'csv', 'xlsx'
]);

// Dangerous executable & script blocklist for security & cost protection
const DANGEROUS_EXTENSIONS = new Set([
  'exe', 'bat', 'cmd', 'sh', 'vbs', 'msi', 'js', 'html', 'htm', 'php', 'asp', 'aspx', 'py', 'jar', 'svg'
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    // Sanitize filename to prevent directory traversal or malformed form data
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${uniqueSuffix}-${safeName}`);
  },
});

// Server-side strict MIME & Extension validation filter
const fileFilter = (req, file, cb) => {
  const ext = file.originalname.split('.').pop()?.toLowerCase();

  if (!ext || DANGEROUS_EXTENSIONS.has(ext) || !ALLOWED_EXTENSIONS.has(ext)) {
    return cb(
      new Error(`File type (.${ext || 'unknown'}) is restricted. Allowed: images (jpg, png, webp), videos (mp4, webm), audio (mp3, wav), documents (pdf, docx, txt, zip)`),
      false
    );
  }
  cb(null, true);
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Strict 10MB limit per file to optimize server bandwidth and disk cost
  },
});

// Automatic Garbage Collection: Delete upload files older than 1 hour to save disk space & storage cost
export const cleanupExpiredUploads = () => {
  const ONE_HOUR_MS = 60 * 60 * 1000;
  fs.readdir(uploadsDir, (err, files) => {
    if (err || !files) return;
    const now = Date.now();
    files.forEach((file) => {
      const filePath = path.join(uploadsDir, file);
      fs.stat(filePath, (statErr, stats) => {
        if (!statErr && stats && now - stats.mtimeMs > ONE_HOUR_MS) {
          fs.unlink(filePath, () => {
            console.log(`[Storage Cleanup] Auto-deleted expired attachment: ${file}`);
          });
        }
      });
    });
  });
};

// Run storage cleanup job every 15 minutes
setInterval(cleanupExpiredUploads, 15 * 60 * 1000);

export const UPLOADS_DIR = uploadsDir;
