import { DrawerActionType } from '../../enums';
import { DrawerAction } from './drawer-action';

export class TriangleAction extends DrawerAction {
  constructor() {
    super();
    this.name = 'triangle';
    this.label = 'Triangle';
    this.order = 5;
    this.type = DrawerActionType.SHAPE;
  }
}
