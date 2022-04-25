import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectAll } from '../reducers/strat-map.reducer';
import { StratMapState } from '../states/strat-map.state';

const stratMapFeature = createFeatureSelector<StratMapState>('StratMapState');

export const getAllStratMaps = createSelector(stratMapFeature, selectAll);

export const getStratMapById = (id: string) =>
  createSelector(getAllStratMaps, (maps) => {
    return maps.find((x) => x._id === id);
  });

export const getSelectedStratMap = createSelector(
  stratMapFeature,
  (state: StratMapState) => state.selectedStratMap
);
