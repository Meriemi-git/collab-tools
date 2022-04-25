import { DrawerOptionType } from '../../enums/drawer/drawer-option-type';
import { DrawerOptionName } from '../../helpers/drawing/drawer-option-name';
import { DrawerOption } from './drawer-option';

export class ItalicOption implements DrawerOption {
  type = DrawerOptionType.TEXT;
  label = 'Italic';
  active = false;
  initialValue = 'normal';
  name = DrawerOptionName.FONT_STYLE;
  value = 'italic';
}
