import { Draw } from '../entities';
import { StratActions } from '../enums';

export interface StratAndAction {
  strat: Draw;
  action: StratActions;
}
