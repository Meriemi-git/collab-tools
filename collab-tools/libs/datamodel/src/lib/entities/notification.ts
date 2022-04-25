import * as mongoose from 'mongoose';
import { NotificationType } from '../enums/notification-type';

export type NotificationDocument = Notification & mongoose.Document;

export interface Notification {
  _id?: string;
  createdAt: Date;
  userId: string;
  type: NotificationType;
  wsRoomId: string;
  content: string;
}

export const NotificationSchema = new mongoose.Schema({
  createdAt: Date,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    enum: Object.values(NotificationType),
    required: true,
  },
  wsRoomId: String,
  content: String,
});
