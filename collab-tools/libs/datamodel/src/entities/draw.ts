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
  votes: number;
  attachedImages: string[];
  mapId: string;
  drawMapImage: string;
  mapName: string;
  isPublic: boolean;
  deprecated: boolean;
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
  votes: Number,
  mapId: {
    type: String,
    required: true,
  },
  attachedImages: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
  isPublic: Boolean,
  deprecated: Boolean,
  canvas: JSON,
});

DrawSchema.plugin(mongoosePaginate);
