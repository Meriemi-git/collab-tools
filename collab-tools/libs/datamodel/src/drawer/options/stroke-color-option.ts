import { DrawerOptionType } from '../../enums/drawer/drawer-option-type';
import { DrawerOptionName } from '../../helpers/drawing/drawer-option-name';
import { DrawerOption } from './drawer-option';

export class StrokeColorOption implements DrawerOption {
  type = DrawerOptionType.COLOR;
  label = 'Stroke color';
  active = false;
  initialValue = 'rgba(255,255,255,1.0)';
  name = DrawerOptionName.STROKE_COLOR;
  value = null;
}
