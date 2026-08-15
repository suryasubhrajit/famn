import mongoose from 'mongoose';
import { mongoPoolManager } from '../config/mongoMultiDb.js';

const messageSchemaDefinition = {
  messageId: { type: String, required: true, index: true },
  roomId: { type: String, required: true, index: true },
  sender: { type: String, required: true },
  avatarColor: { type: String, default: '#6366F1' },
  text: { type: String, default: '' },
  type: { type: String, default: 'text' },
  replyTo: { type: Object, default: null },
  fileUrl: { type: String, default: null },
  fileName: { type: String, default: null },
  fileType: { type: String, default: null },
  fileSize: { type: Number, default: null },
  timestamp: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
};

export const getMessageModel = (conn) => {
  if (!conn) return null;
  const Schema = conn.base.Schema;
  const schema = new Schema(messageSchemaDefinition, { timestamps: true });
  return conn.models.Message || conn.model('Message', schema);
};

export const saveMessageToMultiDb = async (msgData) => {
  if (!mongoPoolManager.isInitialized) return null;
  return mongoPoolManager.executeWithFailover(async (conn) => {
    const Message = getMessageModel(conn);
    return Message.create(msgData);
  });
};

export const getMessagesFromMultiDb = async (roomId) => {
  if (!mongoPoolManager.isInitialized) return null;
  return mongoPoolManager.executeWithFailover(async (conn) => {
    const Message = getMessageModel(conn);
    return Message.find({ roomId }).sort({ timestamp: 1 }).lean();
  });
};
