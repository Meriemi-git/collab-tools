import { DrawerActionType } from '../../enums';
import { DrawerAction } from './drawer-action';

export class RectangleAction extends DrawerAction {
  constructor() {
    super();
    this.name = 'rectangle';
    this.label = 'Rectangle';
    this.order = 6;
    this.type = DrawerActionType.SHAPE;
  }
}
