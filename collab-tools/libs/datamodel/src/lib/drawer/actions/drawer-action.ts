import { DrawerActionType } from '../../enums';

export abstract class DrawerAction {
  name: string;
  label: string;
  order: number;
  type: DrawerActionType;
  active: boolean;
  constructor() {
    this.active = false;
  }
}
