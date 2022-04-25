import { fabric } from 'fabric';
import { LineArrow } from './line-arrow';

export class TriangleArrow extends fabric.Triangle {
  public type: 'TriangleArrow';
  public line: LineArrow;
  public uid: string;
}
