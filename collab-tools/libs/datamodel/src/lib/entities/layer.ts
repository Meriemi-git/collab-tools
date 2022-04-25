import * as mongoose from 'mongoose';
import { Floor, FloorSchema } from './floor';

export type LayerDocument = Layer & mongoose.Document;

export interface Layer {
  canvas: unknown;
  floor: Floor;
  tacticalMode: boolean;
}
export const LayerSchema = new mongoose.Schema({
  floor: {
    type: FloorSchema,
    ref: 'Floor',
  },
  tacticalMode: Boolean,
  canvas: JSON,
});
