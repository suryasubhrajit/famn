import { createUniqueRoom, checkRoomExists, getRoomMessages, extendRoomTTL } from '../services/roomService.js';
import { isValidRoomId } from '../utils/generators.js';

// Create a collision-free unique room ID
export const createRoom = async (req, res) => {
  try {
    const roomId = await createUniqueRoom();
    res.json({ roomId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create room' });
  }
};

// Check if a room exists and is active in Redis/Memory with strict 3-4-3 format check
export const verifyRoomExists = async (req, res) => {
  const { roomId } = req.params;

  if (!isValidRoomId(roomId)) {
    return res.json({ roomId, exists: false, reason: 'invalid_format' });
  }

  try {
    const exists = await checkRoomExists(roomId);
    res.json({ roomId, exists });
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify room' });
  }
};

export const fetchRoomMessages = async (req, res) => {
  const { roomId } = req.params;

  if (!isValidRoomId(roomId)) {
    return res.status(400).json({ error: 'Invalid room format' });
  }

  try {
    const messages = await getRoomMessages(roomId);
    res.json({ roomId, messages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch room messages' });
  }
};

export const extendRoom = async (req, res) => {
  const { roomId } = req.params;
  const { minutes = 30 } = req.body || {};

  if (!isValidRoomId(roomId)) {
    return res.status(400).json({ error: 'Invalid room format' });
  }

  try {
    const extensionSeconds = Math.max(1, parseInt(minutes, 10)) * 60;
    const result = await extendRoomTTL(roomId, extensionSeconds);
    res.json({ roomId, ...result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to extend room TTL' });
  }
};
