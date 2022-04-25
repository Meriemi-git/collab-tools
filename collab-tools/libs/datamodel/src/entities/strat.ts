import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Layer, LayerSchema } from './layer';

export type StratDocument = Strat & mongoose.Document;

export class Strat {
  _id?: string;
  name: string;
  description: string;
  createdAt: Date;
  lastModifiedAt: Date;
  userId: string;
  votes: number;
  layers: Layer[];
  attachedImages: string[];
  mapId: string;
  stratMapImage: string;
  mapName: string;
  isPublic: boolean;
  deprecated: boolean;
}

export const StratSchema = new mongoose.Schema({
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
  layers: [
    {
      type: LayerSchema,
      ref: 'Layer',
    },
  ],
  attachedImages: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
  stratMapImage: String,
  mapName: String,
  isPublic: Boolean,
  deprecated: Boolean,
});

StratSchema.plugin(mongoosePaginate);
