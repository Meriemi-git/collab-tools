import { Document, Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type DrawDocument = Draw & Document;

export class Draw {
  _id?: string;
  name: string;
  description: string;
  createdAt: Date;
  lastModifiedAt: Date;
  userId: string;
  drawMapImage: string;
  canvas: unknown;
}

export const DrawSchema = new Schema({
  name: String,
  description: String,
  createdAt: Date,
  lastModifiedAt: Date,
  userId: {
    type: String,
    required: true,
  },
  canvas: JSON,
});

DrawSchema.plugin(mongoosePaginate);
