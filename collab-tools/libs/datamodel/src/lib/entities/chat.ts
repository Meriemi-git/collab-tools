import * as mongoose from 'mongoose';
import { ChatMessage, ChatMessageSchema } from './chat-message';
import { WebsocketMember, WebsocketMemberSchema } from './websocket-member';

export type ChatDocument = Chat & mongoose.Document;

export interface Chat {
  _id?: string;
  createdAt: Date;
  creatorId: string;
  members: WebsocketMember[];
  messages: ChatMessage[];
  closed: boolean;
  unreadMessageCounter: number;
  joined: boolean;
}

export const ChatSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: Date,
  members: [
    {
      type: WebsocketMemberSchema,
      ref: 'WebsocketMember',
    },
  ],
  messages: [
    {
      type: ChatMessageSchema,
      ref: 'ChatMessage',
    },
  ],
  closed: Boolean,
});
