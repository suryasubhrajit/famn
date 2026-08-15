import mongoose from 'mongoose';
import { mongoPoolManager } from '../config/mongoMultiDb.js';

const roomSchemaDefinition = {
  roomId: { type: String, required: true, unique: true, index: true },
  hostHandle: { type: String, required: true },
  hostColor: { type: String, default: '#6366F1' },
  ttl: { type: String, default: '1h' },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  maxParticipants: { type: Number, default: 20 },
  createdAt: { type: Date, default: Date.now },
};

export const getRoomModel = (conn) => {
  if (!conn) return null;
  const Schema = conn.base.Schema;
  const schema = new Schema(roomSchemaDefinition, { timestamps: true });
  return conn.models.Room || conn.model('Room', schema);
};

export const saveRoomToMultiDb = async (roomData) => {
  if (!mongoPoolManager.isInitialized) return null;
  return mongoPoolManager.executeWithFailover(async (conn) => {
    const Room = getRoomModel(conn);
    return Room.findOneAndUpdate({ roomId: roomData.roomId }, roomData, {
      upsert: true,
      new: true,
    });
  });
};

export const getRoomFromMultiDb = async (roomId) => {
  if (!mongoPoolManager.isInitialized) return null;
  return mongoPoolManager.executeWithFailover(async (conn) => {
    const Room = getRoomModel(conn);
    return Room.findOne({ roomId });
  });
};
