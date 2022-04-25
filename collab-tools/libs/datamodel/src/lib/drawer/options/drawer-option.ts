import { DrawerOptionType } from '../../enums/drawer/drawer-option-type';
import { DrawerOptionName } from '../../helpers/drawing/drawer-option-name';

export interface DrawerOption {
  type: DrawerOptionType;
  label: string;
  name: DrawerOptionName;
  value: unknown;
  initialValue: unknown;
  active: boolean;
}
