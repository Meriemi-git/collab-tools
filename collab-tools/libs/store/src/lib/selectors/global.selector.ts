import { createSelector } from '@ngrx/store';
import { StratEditorState } from '../reducers';
import { StratMapState, StratState } from '../states';

export const stratFeature = (state: StratEditorState) => state.StratState;
export const stratMapFeature = (state: StratEditorState) => state.StratMapState;

export const isStratOrMapDefined = createSelector(
  stratFeature,
  stratMapFeature,
  (stratState: StratState, stratMapState: StratMapState) =>
    stratMapState.selectedStratMap != null || stratState.strat != null
);
