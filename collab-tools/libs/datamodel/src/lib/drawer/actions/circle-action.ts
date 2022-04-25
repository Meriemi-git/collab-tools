import { DrawerActionType } from '../../enums';
import { DrawerAction } from './drawer-action';

export class CircleAction extends DrawerAction {
  constructor() {
    super();
    this.order = 7;
    this.name = 'circle';
    this.label = 'Circle';
    this.type = DrawerActionType.SHAPE;
  }
}
