import { DrawerActionType } from '../../enums';
import { DrawerAction } from './drawer-action';

export class ArrowAction extends DrawerAction {
  constructor() {
    super();
    this.order = 4;
    this.name = 'arrow';
    this.label = 'Arrow';
    this.type = DrawerActionType.SHAPE;
  }
}
