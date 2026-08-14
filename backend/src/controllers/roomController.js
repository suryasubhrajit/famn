import { createUniqueRoom, checkRoomExists, getRoomMessages } from '../services/roomService.js';

// Create a collision-free unique room ID
export const createRoom = async (req, res) => {
  try {
    const roomId = await createUniqueRoom();
    res.json({ roomId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create room' });
  }
};

// Check if a room exists and is active in Redis/Memory
export const verifyRoomExists = async (req, res) => {
  const { roomId } = req.params;

  try {
    const exists = await checkRoomExists(roomId);
    res.json({ roomId, exists });
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify room' });
  }
};

export const fetchRoomMessages = async (req, res) => {
  const { roomId } = req.params;

  try {
    const messages = await getRoomMessages(roomId);
    res.json({ roomId, messages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch room messages' });
  }
};
