import { LineMode } from '@collab-tools/datamodel';
import { fabric } from 'fabric';
import { ObjectDrawer } from './object-drawer';

export class RectangleDrawer extends ObjectDrawer {
  drawingMode: LineMode = LineMode.Rectangle;

  private origX = 0;
  private origY = 0;

  make = (
    x: number,
    y: number,
    options: fabric.IObjectOptions,
    width?: number,
    height?: number
  ): Promise<fabric.Object> => {
    this.origX = x;
    this.origY = y;
    return Promise.resolve(
      new fabric.Rect({
        ...options,
        left: x,
        top: y,
        width: width,
        height: height,
        selectable: false,
        fill: 'transparent',
      })
    );
  };

  resize = (
    object: fabric.Rect,
    x: number,
    y: number
  ): Promise<fabric.Object> => {
    // Calculate size and orientation of resized rectangle
    object
      .set({
        originX: this.origX > x ? 'right' : 'left',
        originY: this.origY > y ? 'bottom' : 'top',
        width: Math.abs(this.origX - x),
        height: Math.abs(this.origY - y),
      })
      .setCoords();
    return Promise.resolve(object);
  };
}
