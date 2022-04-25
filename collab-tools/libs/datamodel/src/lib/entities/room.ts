import * as mongoose from 'mongoose';
import { WebsocketMember, WebsocketMemberSchema } from './websocket-member';

export type RoomDocument = Room & mongoose.Document;

export class Room {
  _id?: string;
  ownerId: string;
  createdAt: Date;
  members: WebsocketMember[];
  closed: boolean;
  stratMapId: string;
  joined: true;
}

export const RoomSchema = new mongoose.Schema({
  createdAt: Date,
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  members: [
    {
      type: WebsocketMemberSchema,
      ref: 'WebsocketMember',
    },
  ],
  stratMapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StratMap',
  },
  closed: Boolean,
});
