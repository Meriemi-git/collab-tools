import * as mongoose from 'mongoose';

export interface ChatMessage {
  content: string;
  userId: string;
  sendAt: Date;
  chatId: string;
}

export const ChatMessageSchema = new mongoose.Schema({
  content: { type: String, maxlength: 256 },
  socketId: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sendAt: { type: Date, default: Date.now },
});
