import { storeMessage, handleRoomParticipantChange } from '../services/roomService.js';
import { generateFriendlyHandle, isValidRoomId } from '../utils/generators.js';

export const registerRoomSocketHandlers = (io, socket) => {
  // 1. Join Room Event (Enforces strict max 2 participants & 3-4-3 room code format)
  socket.on('room:join', async ({ roomId, handle, color }) => {
    if (!roomId || !isValidRoomId(roomId)) {
      socket.emit('room:invalid', { error: 'Invalid room format' });
      return;
    }

    const validHandle = handle && !handle.toLowerCase().includes('peer') ? handle : generateFriendlyHandle();
    const roomSockets = io.sockets.adapter.rooms.get(roomId);

    // Build current active peer list
    const seen = new Set();
    const existingPeers = [];
    if (roomSockets) {
      for (const id of roomSockets) {
        const s = io.sockets.sockets.get(id);
        if (s && s.data.handle && !seen.has(id)) {
          seen.add(id);
          existingPeers.push({ id: s.id, handle: s.data.handle, color: s.data.color || '#6366F1' });
        }
      }
    }

    // STRICT 2-PERSON LOCK: If 2 users are already in the room and this socket is NOT one of them
    const isAlreadyInRoom = existingPeers.some((p) => p.id === socket.id);
    if (existingPeers.length >= 2 && !isAlreadyInRoom) {
      console.log(`[Socket Rejected] ${validHandle} tried to join room ${roomId} but it is FULL (2/2)`);
      socket.emit('room:full', {
        roomId,
        error: 'This room is full. Maximum 2 participants allowed per private session.',
      });
      return;
    }

    socket.join(roomId);
    socket.data.handle = validHandle;
    socket.data.color = color || '#6366F1';
    socket.data.roomId = roomId;

    // Recalculate peer list after join
    const updatedSockets = io.sockets.adapter.rooms.get(roomId);
    const peers = [];
    const updatedSeen = new Set();
    if (updatedSockets) {
      for (const id of updatedSockets) {
        const s = io.sockets.sockets.get(id);
        if (s && s.data.handle && !updatedSeen.has(id)) {
          updatedSeen.add(id);
          peers.push({ id: s.id, handle: s.data.handle, color: s.data.color || '#6366F1' });
        }
      }
    }

    const peerCount = peers.length;

    // Refresh room TTL because participants are present
    await handleRoomParticipantChange(roomId, peerCount);

    io.to(roomId).emit('room:peers', peers);
    console.log(`[Socket Join] ${validHandle} joined room: ${roomId} (Active: ${peerCount}/2)`);
  });

  // 2. Broadcast Message Event
  socket.on('message:send', async ({ roomId, message }) => {
    if (!message || (!message.content && !message.file)) return;

    const processedMessage = {
      id: message.id || `msg-${Date.now()}`,
      roomId,
      sender: {
        handle: socket.data.handle || message.sender?.handle || generateFriendlyHandle(),
        color: socket.data.color || message.sender?.color || '#6366F1',
      },
      content: (message.content || '').substring(0, 5000),
      file: message.file || null,
      replyTo: message.replyTo || null,
      timestamp: new Date().toISOString(),
      reactions: {},
      ttl: message.ttl || '1h',
    };

    socket.to(roomId).emit('message:received', processedMessage);
    await storeMessage(roomId, processedMessage);
  });

  // 3. Emoji Reaction Event
  socket.on('message:react', ({ roomId, messageId, emoji }) => {
    if (!messageId || !emoji) return;
    io.to(roomId).emit('message:reaction_added', { messageId, emoji });
  });

  // 4. Delete Message Event
  socket.on('message:delete', ({ roomId, messageId }) => {
    if (!messageId) return;
    io.to(roomId).emit('message:deleted', { messageId });
  });

  // 5. Typing Indicator Event
  socket.on('user:typing', ({ roomId }) => {
    const handle = socket.data.handle;
    if (handle) {
      socket.to(roomId).emit('user:typing', { handle });
    }
  });

  // 6. Change Redis Auto-Destruct TTL Event
  socket.on('room:set_ttl', ({ roomId, ttl }) => {
    io.to(roomId).emit('room:ttl_changed', { ttl });
  });

  // Helper: Rebuild peer list and emit update after a user leaves
  const broadcastPeersAfterLeave = async (roomId) => {
    if (!roomId) return;

    const roomSockets = io.sockets.adapter.rooms.get(roomId);

    const seen = new Set();
    const peers = [];
    if (roomSockets) {
      for (const id of roomSockets) {
        if (id === socket.id) continue;
        const s = io.sockets.sockets.get(id);
        if (s && s.data.handle && !seen.has(id)) {
          seen.add(id);
          peers.push({ id: s.id, handle: s.data.handle, color: s.data.color });
        }
      }
    }

    const peerCount = peers.length;
    io.to(roomId).emit('room:peers', peers);

    // Schedule fast auto-destruct TTL if room is now empty
    await handleRoomParticipantChange(roomId, peerCount);
    console.log(`[Socket Left] ${socket.data.handle} left room: ${roomId} (Remaining: ${peerCount})`);
  };

  // 7. Explicit Leave Room Event
  socket.on('room:leave', async ({ roomId }) => {
    socket.leave(roomId);
    socket.data.roomId = null;
    await broadcastPeersAfterLeave(roomId);
  });

  // 8. Disconnect Event
  socket.on('disconnect', async () => {
    const roomId = socket.data.roomId;
    console.log(`[Socket Disconnected] ID: ${socket.id} Handle: ${socket.data.handle}`);
    await broadcastPeersAfterLeave(roomId);
  });
};
