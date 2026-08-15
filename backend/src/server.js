import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { initRedis } from './config/redis.js';
import { initMongoPool } from './config/mongoMultiDb.js';
import { UPLOADS_DIR } from './config/multer.js';
import apiRoutes from './routes/index.js';
import { registerRoomSocketHandlers } from './sockets/roomHandler.js';

dotenv.config();

const app = express();
app.set('trust proxy', 1);
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Storage Engines (Upstash Redis & MongoDB Atlas Multi-Cluster)
initRedis();
initMongoPool();

// Express Middlewares
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Serve Static Uploads & Public Brand Assets (Logos, Favicons, CSS)
const publicDir = path.join(process.cwd(), 'public');
app.use('/public', express.static(publicDir));
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
  next();
}, express.static(UPLOADS_DIR));

// Mount REST API Router & Health Dashboard
app.use('/api', apiRoutes);
app.get('/health', (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'health.html')));
app.get('/status', (req, res) => res.sendFile(path.join(process.cwd(), 'public', 'health.html')));

// Initialize Socket.io Server
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

// Socket Connection Listener
io.on('connection', (socket) => {
  registerRoomSocketHandlers(io, socket);
});

// Start Server
httpServer.listen(PORT, () => {
  console.log(`🚀 Fun At Mid Night Backend Server running on http://localhost:${PORT}`);
  console.log(`🖼️ Static Brand Resources accessible at http://localhost:${PORT}/public/logo.svg`);
});
