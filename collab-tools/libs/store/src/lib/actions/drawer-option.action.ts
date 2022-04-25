import { createAction, props } from '@ngrx/store';
import { DrawerOption, DrawerOptionName } from '@collab-tools/datamodel';

export const FeedDrawerOptions = createAction(
  '[DrawerOption] Feed Drawer Options',
  props<{ drawerOptions: DrawerOption[] }>()
);

export const SetFontSize = createAction(
  '[DrawerOption] Set font size',
  props<{ fontSize: number }>()
);
export const SetFillColor = createAction(
  '[DrawerOption] Set Fill Color',
  props<{ colorValue: string }>()
);

export const SetStrokeWidth = createAction(
  '[DrawerOption] Set Stroke Width',
  props<{ width: number }>()
);

export const SetStrokeColor = createAction(
  '[DrawerOption] Set Stroke Color',
  props<{ colorValue: string }>()
);
export const ToogleDrawerOptionActivation = createAction(
  '[DrawerOption] Toogle Drawer Options activation',
  props<{ option: DrawerOption }>()
);

export const SetOptionInactive = createAction(
  '[DrawerAction] Set Drawer Options',
  props<{ name: DrawerOptionName }>()
);
