import { getRedisClient } from '../config/redis.js';
import { generateUniqueRoomId } from '../utils/generators.js';
import { saveRoomToMultiDb } from '../models/Room.js';
import { saveMessageToMultiDb, getMessagesFromMultiDb } from '../models/Message.js';

const memoryRoomMessages = new Map();
const memoryRoomMeta = new Map();

export const parseTTLSeconds = (ttlString) => {
  switch (ttlString) {
    case '15m': return 15 * 60;
    case '1h': return 60 * 60;
    case '24h': return 24 * 60 * 60;
    case 'burn': return 120; // 2 Minutes TTL for burn on read
    default: return 3600;
  }
};

// Check if a room ID exists in Redis or Memory
export const checkRoomExists = async (roomId) => {
  const redis = getRedisClient();

  if (redis) {
    try {
      const exists = await redis.exists(`room:${roomId}:meta`, `room:${roomId}:messages`);
      return exists > 0;
    } catch (err) {
      console.error('[RoomService Exists Check Error]', err.message);
    }
  }

  return memoryRoomMeta.has(roomId) || memoryRoomMessages.has(roomId);
};

// Generate a guaranteed unused room code by checking Redis/Memory collisions
export const createUniqueRoom = async () => {
  let roomId = generateUniqueRoomId();
  let attempts = 0;

  while ((await checkRoomExists(roomId)) && attempts < 10) {
    roomId = generateUniqueRoomId();
    attempts++;
  }

  const redis = getRedisClient();
  const defaultTtlSeconds = 3600; // 1 Hour default

  if (redis) {
    try {
      const metaKey = `room:${roomId}:meta`;
      await redis.hset(metaKey, {
        createdAt: new Date().toISOString(),
        ttl: '1h',
        activeParticipants: 1,
      });
      await redis.expire(metaKey, defaultTtlSeconds);
    } catch (err) {
      console.error('[RoomService Create Error]', err.message);
    }
  }

  memoryRoomMeta.set(roomId, {
    createdAt: new Date().toISOString(),
    ttl: '1h',
    activeParticipants: 1,
  });

  // Async sync to MongoDB Atlas Cluster if configured
  saveRoomToMultiDb({
    roomId,
    hostHandle: 'Host',
    ttl: '1h',
    expiresAt: new Date(Date.now() + defaultTtlSeconds * 1000),
  }).catch((err) => console.warn('[Mongo Room Sync Warning]', err.message));

  return roomId;
};

// Store message with TTL
export const storeMessage = async (roomId, message) => {
  const redis = getRedisClient();
  const ttlSeconds = parseTTLSeconds(message.ttl || '1h');

  // Async sync message to MongoDB Atlas Cluster
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
  saveMessageToMultiDb({
    messageId: message.id || `msg-${Date.now()}`,
    roomId,
    sender: message.sender?.handle || 'Anonymous',
    avatarColor: message.sender?.color || '#6366F1',
    text: message.content || '',
    type: message.file ? 'file' : 'text',
    replyTo: message.replyTo || null,
    fileUrl: message.file?.url || null,
    fileName: message.file?.name || null,
    fileType: message.file?.type || null,
    fileSize: message.file?.size || null,
    timestamp: new Date(message.timestamp || Date.now()),
    expiresAt,
  }).catch((err) => console.warn('[Mongo Message Sync Warning]', err.message));

  if (redis) {
    try {
      const key = `room:${roomId}:messages`;
      await redis.rpush(key, JSON.stringify(message));
      await redis.expire(key, ttlSeconds);

      // Keep metadata key TTL in sync
      await redis.expire(`room:${roomId}:meta`, ttlSeconds);
      return;
    } catch (err) {
      console.error('[RoomService Redis Store Error]', err.message);
    }
  }

  if (!memoryRoomMessages.has(roomId)) {
    memoryRoomMessages.set(roomId, []);
  }
  memoryRoomMessages.get(roomId).push(message);
};

const emptyRoomTimers = new Map();

// Purge/Delete room immediately from Redis and Memory
export const deleteRoom = async (roomId) => {
  if (emptyRoomTimers.has(roomId)) {
    clearTimeout(emptyRoomTimers.get(roomId));
    emptyRoomTimers.delete(roomId);
  }

  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.del(`room:${roomId}:meta`, `room:${roomId}:messages`);
      console.log(`[Room Purged] Room ${roomId} deleted from Redis.`);
    } catch (err) {
      console.error('[Room Purge Error]', err.message);
    }
  }
  memoryRoomMeta.delete(roomId);
  memoryRoomMessages.delete(roomId);
};

// Handle room empty / user disconnect inactivity cleanup with 5-minute grace period
export const handleRoomParticipantChange = async (roomId, activeParticipantCount) => {
  const redis = getRedisClient();

  if (activeParticipantCount === 0) {
    // Start 5-minute (300s) grace period before purging empty room
    if (!emptyRoomTimers.has(roomId)) {
      console.log(`[Room Grace Period] Room ${roomId} is empty (0 peers). Starting 5-minute cleanup timer.`);
      if (redis) {
        try {
          await redis.expire(`room:${roomId}:messages`, 300);
          await redis.expire(`room:${roomId}:meta`, 300);
        } catch (err) {}
      }

      const timer = setTimeout(async () => {
        console.log(`[Room Grace Expired] Room ${roomId} remained empty for 5 minutes. Purging.`);
        emptyRoomTimers.delete(roomId);
        await deleteRoom(roomId);
      }, 5 * 60 * 1000); // 5 Minutes Grace Period

      emptyRoomTimers.set(roomId, timer);
    }
  } else {
    // Users active in room, cancel empty room cleanup timer & restore 1-hour TTL
    if (emptyRoomTimers.has(roomId)) {
      console.log(`[Room Restored] Peer joined empty room ${roomId}. Cancelling 5-minute cleanup timer.`);
      clearTimeout(emptyRoomTimers.get(roomId));
      emptyRoomTimers.delete(roomId);
    }

    if (redis) {
      try {
        await redis.expire(`room:${roomId}:messages`, 3600);
        await redis.expire(`room:${roomId}:meta`, 3600);
      } catch (err) {}
    }
  }
};

// Extend room lifetime by custom duration (default +30 minutes)
export const extendRoomTTL = async (roomId, extensionSeconds = 1800) => {
  const redis = getRedisClient();

  if (emptyRoomTimers.has(roomId)) {
    clearTimeout(emptyRoomTimers.get(roomId));
    emptyRoomTimers.delete(roomId);
  }

  if (redis) {
    try {
      await redis.expire(`room:${roomId}:messages`, extensionSeconds);
      await redis.expire(`room:${roomId}:meta`, extensionSeconds);
      console.log(`[Room Extended] Room ${roomId} TTL extended by ${extensionSeconds}s.`);
      return { success: true, extensionSeconds };
    } catch (err) {
      console.error('[Room Extend Error]', err.message);
    }
  }

  if (memoryRoomMeta.has(roomId)) {
    const meta = memoryRoomMeta.get(roomId);
    meta.extendedAt = new Date().toISOString();
    return { success: true, extensionSeconds };
  }

  return { success: false, reason: 'room_not_found' };
};

export const getRoomMessages = async (roomId) => {
  const redis = getRedisClient();

  if (redis) {
    try {
      const raw = await redis.lrange(`room:${roomId}:messages`, 0, -1);
      if (raw && raw.length > 0) {
        return raw.map((m) => JSON.parse(m));
      }
    } catch (err) {
      console.error('[RoomService Get Error]', err.message);
    }
  }

  const inMem = memoryRoomMessages.get(roomId);
  if (inMem && inMem.length > 0) {
    return inMem;
  }

  // Fallback to MongoDB multi-DB cluster if present
  try {
    const mongoMsgs = await getMessagesFromMultiDb(roomId);
    if (mongoMsgs && mongoMsgs.length > 0) {
      return mongoMsgs.map((m) => ({
        id: m.messageId,
        roomId: m.roomId,
        sender: { handle: m.sender, color: m.avatarColor },
        content: m.text,
        file: m.fileUrl ? { url: m.fileUrl, name: m.fileName, type: m.fileType, size: m.fileSize } : null,
        replyTo: m.replyTo,
        timestamp: m.timestamp,
      }));
    }
  } catch (err) {
    console.warn('[Mongo Get Messages Warning]', err.message);
  }

  return [];
};

export const getTelemetryKpis = async () => {
  const redis = getRedisClient();
  let activeRooms = memoryRoomMeta.size;
  let totalMessages = 0;

  for (const msgs of memoryRoomMessages.values()) {
    totalMessages += msgs.length;
  }

  if (redis) {
    try {
      const keys = await redis.keys('room:*:meta');
      activeRooms = Math.max(activeRooms, keys.length);
      const msgKeys = await redis.keys('room:*:messages');
      for (const k of msgKeys) {
        const len = await redis.llen(k);
        totalMessages += len;
      }
    } catch (err) {}
  }

  return {
    activeRooms,
    totalMessages,
  };
};
