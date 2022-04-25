import { DrawerActionType } from '../../enums';
import { DrawerAction } from './drawer-action';

export class PolyLineAction extends DrawerAction {
  constructor() {
    super();
    this.name = 'polyline';
    this.label = 'Free';
    this.order = 2;
    this.type = DrawerActionType.SHAPE;
  }
}
