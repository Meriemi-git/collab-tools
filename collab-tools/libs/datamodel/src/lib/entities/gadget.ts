import * as mongoose from 'mongoose';
import { GadgetType } from '../enums/gadget-type';

export type GadgetDocument = Gadget & mongoose.Document;

export interface Gadget {
  _id?: string;
  name: string;
  image: string;
  type: GadgetType;
}

export const GadgetSchema = new mongoose.Schema({
  name: String,
  image: String,
  type: String,
});
