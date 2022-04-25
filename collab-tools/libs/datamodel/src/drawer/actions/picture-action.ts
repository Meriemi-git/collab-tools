import { DrawerActionType } from '../../enums';
import { DrawerAction } from './drawer-action';

export class PictureAction extends DrawerAction {
  constructor() {
    super();
    this.name = 'picture';
    this.label = 'Picture';
    this.order = 3;
    this.type = DrawerActionType.FORM;
  }
}
