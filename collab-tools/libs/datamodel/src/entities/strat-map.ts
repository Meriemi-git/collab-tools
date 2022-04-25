import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Floor, FloorSchema } from './floor';

export type DrawMapDocument = DrawMap & mongoose.Document;

export interface DrawMap {
  _id?: string;
  name: string;
  year: number;
  season: number;
  image: string;
  floors: Floor[];
}

export const DrawMapSchema = new mongoose.Schema({
  name: String,
  badge: String,
  year: Number,
  season: Number,
  image: String,
  floors: [
    {
      type: FloorSchema,
      ref: 'Floor',
    },
  ],
});

DrawMapSchema.plugin(mongoosePaginate);
