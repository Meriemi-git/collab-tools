import { Draw } from '../entities';
import { DrawActions } from '../enums';

export interface DrawAndAction {
  draw: Draw;
  action: DrawActions;
}
