import { DrawerActionType } from '../../enums';
import { DrawerAction } from './drawer-action';

export class LineAction extends DrawerAction {
  constructor() {
    super();
    this.order = 3;
    this.name = 'line';
    this.label = 'Line';
    this.type = DrawerActionType.SHAPE;
  }
}
