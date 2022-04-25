import { DrawerOptionType } from '../../enums/drawer/drawer-option-type';
import { DrawerOptionName } from '../../helpers/drawing/drawer-option-name';
import { DrawerOption } from './drawer-option';

export class StrokeWidthOption implements DrawerOption {
  type = DrawerOptionType.MISC;
  label = 'Stroke width';
  active = false;
  initialValue = 1;
  name = DrawerOptionName.STROKE_WIDTH;
  value = null;
}
