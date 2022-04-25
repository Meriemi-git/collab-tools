import { DrawerActionType } from '../../enums';
import { DrawerAction } from './drawer-action';

export class StarAction extends DrawerAction {
  constructor() {
    super();
    this.name = 'star';
    this.order = 1;
    this.type = DrawerActionType.FORM;
  }
}
