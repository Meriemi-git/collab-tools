import * as mongoose from 'mongoose';
import { WebsocketMemberRole, WebsocketStatus } from '../enums';

export interface WebsocketMember {
  userId: string;
  username: string;
  socketId: string;
  status: WebsocketStatus;
  role: WebsocketMemberRole;
}
export const WebsocketMemberSchema = new mongoose.Schema({
  status: String,
  socketId: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String,
  role: String,
});
