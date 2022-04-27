import { LineMode } from '@collab-tools/datamodel';
import { fabric } from 'fabric';
import { ObjectDrawer } from './object-drawer';

export class LineDrawer implements ObjectDrawer {
  drawingMode: LineMode = LineMode.Line;
  make(
    x: number,
    y: number,
    options: fabric.IObjectOptions,
    x2?: number,
    y2?: number
  ): Promise<fabric.Object[]> {
    return Promise.resolve([
      new fabric.Line([x, y, x2, y2], {
        ...options,
        selectable: false,
      }),
    ]);
  }

  resize(line: fabric.Line, x: number, y: number): Promise<fabric.Object> {
    line
      .set({
        x2: x,
        y2: y,
      })
      .setCoords();
    return Promise.resolve(line);
  }
}
