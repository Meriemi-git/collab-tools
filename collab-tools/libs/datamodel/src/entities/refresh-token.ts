import * as mongoose from 'mongoose';

export type RefreshTokenDocument = RefreshToken & mongoose.Document;

export interface RefreshToken {
  _id?: string;
  userId: string;
  creationDate: Date;
}

export const RefreshTokenSchema = new mongoose.Schema({
  userId: String,
  creationDate: Date,
});
