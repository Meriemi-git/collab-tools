import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectAll } from '../reducers/strat.reducer';
import { StratState } from '../states/strat.state';

/**
 * Strat state
 */
const stratFeature = createFeatureSelector<StratState>('StratState');

export const getStratState = createSelector(
  stratFeature,
  (state: StratState) => state
);

export const selectAllStrats = createSelector(stratFeature, selectAll);

export const getStratPageMetadata = createSelector(
  getStratState,
  (state: StratState) => state.pageMetadata
);

export const getAllStratLayers = createSelector(
  getStratState,
  (state: StratState) => state.strat?.layers
);

export const getStrat = createSelector(
  getStratState,
  (state: StratState) => state.strat
);

export const getActiveLayer = createSelector(
  getStratState,
  (state: StratState) => state.activeLayer
);
