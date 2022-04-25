import { LineMode } from '@collab-tools/datamodel';
import { fabric } from 'fabric';
import { ObjectDrawer } from './object-drawer';

export class PolyLineDrawer implements ObjectDrawer {
  drawingMode: LineMode = LineMode.Polyline;

  make(
    x: number,
    y: number,
    options: fabric.IObjectOptions,
    rx?: number,
    ry?: number
  ): Promise<fabric.Object> {
    return Promise.resolve(
      new fabric.Polyline([{ x, y }], {
        ...options,
        fill: 'transparent',
      })
    );
  }

  resize(
    object: fabric.Polyline,
    x: number,
    y: number
  ): Promise<fabric.Object> {
    if (object.points) {
      object.points.push(new fabric.Point(x, y));
      const dim = object._calcDimensions();
      object
        .set({
          left: dim.left,
          top: dim.top,
          width: dim.width,
          height: dim.height,
          selectable: false,
          dirty: true,
          pathOffset: new fabric.Point(
            dim.left + dim.width / 2,
            dim.top + dim.height / 2
          ),
        })
        .setCoords();
    }
    return Promise.resolve(object);
  }
}
