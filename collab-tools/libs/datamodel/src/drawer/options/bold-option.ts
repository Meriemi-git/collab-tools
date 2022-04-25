import { DrawerOptionType } from '../../enums/drawer/drawer-option-type';
import { DrawerOptionName } from '../../helpers/drawing/drawer-option-name';
import { DrawerOption } from './drawer-option';

export class BoldOption implements DrawerOption {
  type = DrawerOptionType.TEXT;
  label = 'Bold';
  active = false;
  initialValue = 'normal';
  name = DrawerOptionName.FONT_WEIGHT;
  value = 'bold';
}
