import { LineMode } from '@collab-tools/datamodel';
import { fabric } from 'fabric';
import { ObjectDrawer } from './object-drawer';

export class OvalDrawer implements ObjectDrawer {
  private origX: number;
  private origY: number;

  drawingMode: LineMode = LineMode.Oval;

  make(
    x: number,
    y: number,
    options: fabric.IObjectOptions,
    rx?: number,
    ry?: number
  ): Promise<fabric.Object> {
    this.origX = x;
    this.origY = y;

    return Promise.resolve(
      new fabric.Ellipse({
        ...options,
        left: x,
        top: y,
        rx: rx,
        ry: ry,
        fill: 'transparent',
        selectable: false,
      })
    );
  }

  resize(object: fabric.Ellipse, x: number, y: number): Promise<fabric.Object> {
    object
      .set({
        originX: this.origX > x ? 'right' : 'left',
        originY: this.origY > y ? 'bottom' : 'top',
        rx: Math.abs(x - object.left) / 2,
        ry: Math.abs(y - object.top) / 2,
      })
      .setCoords();
    return Promise.resolve(object);
  }
}
