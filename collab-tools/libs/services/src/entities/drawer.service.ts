import { Injectable } from '@angular/core';
import {
  ArrowAction,
  BoldOption,
  CircleAction,
  DrawerAction,
  DrawerOption,
  FillColorOption,
  FontSizeOption,
  ItalicOption,
  LineAction,
  LocationAction,
  PolyLineAction,
  RectangleAction,
  StarAction,
  StrokeColorOption,
  StrokeWidthOption,
  TextAction,
  TimeAction,
  TriangleAction,
  UnderlineOption,
} from '@collab-tools/datamodel';

@Injectable({
  providedIn: 'root',
})
export class DrawerService {
  public actions: DrawerAction[] = [];
  public options: DrawerOption[] = [];
  constructor() {
    this.actions.push(new LineAction());
    this.actions.push(new ArrowAction());
    this.actions.push(new TriangleAction());
    this.actions.push(new RectangleAction());
    this.actions.push(new CircleAction());
    this.actions.push(new PolyLineAction());

    this.actions.push(new StarAction());
    this.actions.push(new TimeAction());
    this.actions.push(new LocationAction());

    this.actions.push(new TextAction());

    this.options.push(new UnderlineOption());
    this.options.push(new BoldOption());
    this.options.push(new ItalicOption());
    this.options.push(new StrokeColorOption());
    this.options.push(new FillColorOption());
    this.options.push(new FontSizeOption());
    this.options.push(new StrokeWidthOption());
  }
}
