import { Layer } from '../entities';
import { StratActions } from '../enums';

export interface LayerAndAction {
  layer: Layer;
  action: StratActions;
}
