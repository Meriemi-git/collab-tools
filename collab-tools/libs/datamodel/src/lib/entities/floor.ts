import * as mongoose from 'mongoose';

export type FloorDocument = Floor & mongoose.Document;

export interface Floor {
  _id?: string;
  name: string;
  image_realistic: string;
  image_tactical: string;
  level: number;
  isValid: boolean;
}

export const FloorSchema = new mongoose.Schema({
  name: String,
  image_realistic: String,
  image_tactical: String,
  level: Number,
  isValid: Boolean,
});
