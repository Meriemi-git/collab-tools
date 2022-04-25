import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type DrawDocument = Draw & mongoose.Document;

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
  stratMapImage: string;
  mapName: string;
  isPublic: boolean;
  deprecated: boolean;
}

export const DrawSchema = new mongoose.Schema({
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
});

DrawSchema.plugin(mongoosePaginate);
