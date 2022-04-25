import { Inject, Injectable } from '@angular/core';
import { LineMode } from '@collab-tools/datamodel';
import { ImageHelperService } from '@collab-tools/services';
import { fabric } from 'fabric';
import { ObjectDrawer } from './object-drawer';

@Injectable()
export class SvgDrawer implements ObjectDrawer {
  drawingMode: LineMode = LineMode.Svg;
  private svgName: string;
  public origX!: number;
  public origY!: number;
  constructor(
    @Inject('svgName')
    svgName: string,
    private readonly ihs: ImageHelperService
  ) {
    this.svgName = svgName;
  }

  make(
    x: number,
    y: number,
    drawerOptions: fabric.IObjectOptions
  ): Promise<fabric.Object> {
    return new Promise<fabric.Object>((resolve) => {
      this.origX = x;
      this.origY = y;
      fabric.loadSVGFromURL(
        this.ihs.getSvgIconByName(this.svgName) ?? '',
        function (objects, options) {
          const shape = fabric.util.groupSVGElements(objects, options);
          if (shape) {
            const width = shape && shape.width ? shape.width : 0;
            const height = shape && shape.height ? shape.height : 0;
            shape.set({
              stroke: drawerOptions.stroke,
              fill: drawerOptions.fill,
              left: x - width,
              top: y - height,
              scaleX: 2,
              scaleY: 2,
              selectable: false,
            });
            resolve(shape);
          }
        }
      );
    });
  }

  resize(shape: fabric.Object, _x: number, _y: number): Promise<fabric.Object> {
    return Promise.resolve(shape);
  }
}
