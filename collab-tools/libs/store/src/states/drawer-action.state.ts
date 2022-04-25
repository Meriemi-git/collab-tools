import { EntityState } from '@ngrx/entity';
import { DrawerAction, DrawingMode } from '@collab-tools/datamodel';

export interface DrawerActionState extends EntityState<DrawerAction> {
  selectedAction: DrawerAction | null;
  drawingMode: DrawingMode;
}
