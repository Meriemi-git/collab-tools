import { DrawerOptionType } from '../../enums/drawer/drawer-option-type';
import { DrawerOptionName } from '../../helpers/drawing/drawer-option-name';
import { DrawerOption } from './drawer-option';

export class UnderlineOption implements DrawerOption {
  type = DrawerOptionType.TEXT;
  label = 'Underlined';
  active = false;
  initialValue = false;
  name = DrawerOptionName.UNDERLINED;
  value = true;
}
