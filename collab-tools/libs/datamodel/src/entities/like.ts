import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export type LikeDocument = Like & mongoose.Document;

export interface Like {
  userId: string;
  drawId: string;
}

export const LikeSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  drawId: {
    type: Schema.Types.ObjectId,
    ref: 'DrawMap',
  },
});
LikeSchema.index({ userId: 1, drawId: 1 }, { unique: true });
