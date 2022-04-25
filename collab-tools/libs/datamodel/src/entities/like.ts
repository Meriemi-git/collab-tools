import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export type LikeDocument = Like & mongoose.Document;

export interface Like {
  userId: string;
  stratId: string;
}

export const LikeSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  stratId: {
    type: Schema.Types.ObjectId,
    ref: 'StratMap',
  },
});
LikeSchema.index({ userId: 1, stratId: 1 }, { unique: true });
