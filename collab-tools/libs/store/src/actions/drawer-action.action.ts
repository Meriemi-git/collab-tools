import { createAction, props } from '@ngrx/store';
import { DrawerAction, DrawingMode } from '@collab-tools/datamodel';

export const FeedDrawerActions = createAction(
  '[DrawerAction] Feed Drawer Action',
  props<{ drawingActions: DrawerAction[] }>()
);

export const UnSelectDrawerAction = createAction(
  '[DrawerAction] Unselect Drawer Action'
);

export const SetDrawerAction = createAction(
  '[DrawerAction] Set Drawer Action',
  props<{ action: DrawerAction }>()
);

export const SetDrawingMode = createAction(
  '[DrawerAction] Set Drawing Mode',
  props<{ drawingMode: DrawingMode }>()
);
