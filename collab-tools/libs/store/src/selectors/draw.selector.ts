import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectAll } from '../reducers/draw.reducer';
import { DrawState } from '../states/draw.state';

/**
 * Strat state
 */
const stratFeature = createFeatureSelector<DrawState>('StratState');

export const getStratState = createSelector(
  stratFeature,
  (state: DrawState) => state
);

export const selectAllStrats = createSelector(stratFeature, selectAll);

export const getStratPageMetadata = createSelector(
  getStratState,
  (state: DrawState) => state.pageMetadata
);

export const getStrat = createSelector(
  getStratState,
  (state: DrawState) => state.draw
);
