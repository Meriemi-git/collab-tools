import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { Side } from '../enums/side';
import { Gadget } from './gadget';

export type AgentDocument = Agent & mongoose.Document;

export interface Agent {
  _id?: string;
  name: string;
  year: number;
  season: number;
  image: string;
  portrait: string;
  side: Side;
  description: string;
  roles: string[];
  primaryGadget?: Gadget;
  secondaryGadgets: Gadget[];
}

export const AgentSchema = new mongoose.Schema({
  name: String,
  image: String,
  year: Number,
  season: Number,
  side: String,
  portrait: String,
  description: String,
  roles: [
    {
      type: String,
    },
  ],
  primaryGadget: { type: Schema.Types.ObjectId, ref: 'Gadget' },
  secondaryGadgets: [{ type: Schema.Types.ObjectId, ref: 'Gadget' }],
});
