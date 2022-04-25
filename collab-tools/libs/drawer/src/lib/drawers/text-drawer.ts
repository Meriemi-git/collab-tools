import { LineMode } from '@collab-tools/datamodel';
import { fabric } from 'fabric';
import { ObjectDrawer } from './object-drawer';

export class TextDrawer implements ObjectDrawer {
  drawingMode: LineMode = LineMode.Text;

  make(
    x: number,
    y: number,
    options: fabric.ITextboxOptions
  ): Promise<fabric.Textbox> {
    const textbox = new fabric.Textbox('Your text here...', {
      ...options,
      fontStyle: options.fontStyle ?? '',
      fontWeight: options.fontWeight ?? '',
      fontFamily: options.fontFamily ?? '',
      fontSize: options.fontSize ?? 0,
      underline: options.underline ?? false,
      left: x,
      top: y,
      editable: true,
    });
    return Promise.resolve(textbox);
  }

  resize(object: fabric.Textbox, x: number, y: number): Promise<fabric.Object> {
    object
      .set({
        left: x,
        top: y,
      })
      .setCoords();
    return Promise.resolve(object);
  }
}
