import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectAll } from '../reducers/drawer-action.reducer';
import { DrawerActionState } from '../states/drawer-action.state';

const drawingActionFeature =
  createFeatureSelector<DrawerActionState>('DrawerActionState');

export const getAllActions = createSelector(drawingActionFeature, selectAll);

export const getDrawingMode = createSelector(
  drawingActionFeature,
  (state: DrawerActionState) => state.drawingMode
);

export const getSelectedAction = createSelector(
  drawingActionFeature,
  (state: DrawerActionState) => state.selectedAction
);
