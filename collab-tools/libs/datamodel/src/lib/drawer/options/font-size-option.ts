import { DrawerOptionType } from '../../enums/drawer/drawer-option-type';
import { DrawerOptionName } from '../../helpers/drawing/drawer-option-name';
import { DrawerOption } from './drawer-option';

export class FontSizeOption implements DrawerOption {
  type = DrawerOptionType.MISC;
  label = 'Font Size';
  active = false;
  initialValue = 50;
  name = DrawerOptionName.FONT_SIZE;
  value = null;
}
