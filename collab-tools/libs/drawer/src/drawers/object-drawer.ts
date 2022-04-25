import { LineMode } from '@collab-tools/datamodel';
import { fabric } from 'fabric';
import { IndexedOptions } from '../fabricjs/indexed-options';

export class ObjectDrawer {
  drawingMode: LineMode;
  // Makes the current object
  readonly make: (
    x: number, // Horizontal starting point
    y: number, // Vertical starting point
    options: IndexedOptions,
    x2?: number, // Horizontal ending point
    y2?: number // Vertical ending point
  ) => Promise<fabric.Object>;

  // Resizes the object (used during the mouseOver event below)
  readonly resize: (
    object: fabric.Object,
    x: number,
    y: number
  ) => Promise<fabric.Object>;
}
