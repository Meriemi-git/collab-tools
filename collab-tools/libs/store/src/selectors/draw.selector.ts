import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectAll } from '../reducers/draw.reducer';
import { DrawState } from '../states/draw.state';

/**
 * Draw state
 */
const drawFeature = createFeatureSelector<DrawState>('DrawState');

export const getDrawState = createSelector(
  drawFeature,
  (state: DrawState) => state
);

export const selectAllDraws = createSelector(drawFeature, selectAll);

export const getDrawPageMetadata = createSelector(
  getDrawState,
  (state: DrawState) => state.pageMetadata
);

export const getDraw = createSelector(
  getDrawState,
  (state: DrawState) => state.draw
);
