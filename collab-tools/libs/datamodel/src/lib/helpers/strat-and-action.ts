import { Strat } from '../entities';
import { StratActions } from '../enums';

export interface StratAndAction {
  strat: Strat;
  action: StratActions;
}
