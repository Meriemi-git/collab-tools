import { Layer } from '../entities';
import { DrawActions } from '../enums';

export interface LayerAndAction {
  layer: Layer;
  action: DrawActions;
}
