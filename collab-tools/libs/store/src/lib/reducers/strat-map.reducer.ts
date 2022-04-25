import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { StratMap } from '@collab-tools/datamodel';
import * as actions from '../actions/strat-map.action';
import { StratMapState } from '../states/strat-map.state';

export const adapter: EntityAdapter<StratMap> = createEntityAdapter<StratMap>({
  sortComparer: sortByName,
  selectId: (map: StratMap) => map._id,
});

export function sortByName(a: StratMap, b: StratMap): number {
  return a.name.localeCompare(b.name);
}

export const initialstate: StratMapState = adapter.getInitialState({
  error: null,
  selectedStratMap: null,
  tacticalViewEnabled: false,
});

const mapReducer = createReducer(
  initialstate,
  on(actions.FetchStratMapsSuccess, (state, { stratMaps }) => {
    return adapter.addMany(stratMaps, { ...state, error: null });
  }),
  on(actions.SelectStratMap, (state, { stratMap: map }) => ({
    ...state,
    selectedStratMap: map,
  })),
  on(actions.ClearStratMapState, (state) => ({
    ...state,
    error: null,
    selectedStratMap: null,
  })),
  on(actions.AddStratMapSuccess, (state, { stratMap }) => {
    return adapter.addOne(stratMap, { ...state, error: null });
  }),
  on(actions.StratMapError, (state, { error }) => ({
    ...state,
    error: error,
  })),
  on(actions.UpdateStratMapSuccess, (state, { stratMap }) => {
    return adapter.updateOne(
      { id: stratMap._id, changes: stratMap },
      { ...state, error: null }
    );
  }),
  on(actions.DeleteStratMapSuccess, (state, { stratMapId }) => {
    return adapter.removeOne(stratMapId, {
      ...state,
      error: null,
    });
  }),
  on(actions.UpdateStratMapFloors, (state, { mapId, floors }) => {
    return adapter.updateOne(
      { id: mapId, changes: { floors: floors } },
      { ...state, error: null }
    );
  }),
  on(actions.AddFloorSuccess, (state, { stratMap }) => {
    return adapter.updateOne(
      { id: stratMap._id, changes: stratMap },
      { ...state, error: null }
    );
  }),
  on(actions.UpdateFloorSuccess, (state, { stratMap }) => {
    return adapter.updateOne(
      { id: stratMap._id, changes: stratMap },
      { ...state, error: null }
    );
  }),
  on(actions.DeleteFloorSuccess, (state, { stratMap }) => {
    return adapter.updateOne(
      { id: stratMap._id, changes: stratMap },
      { ...state, error: null }
    );
  })
);

export function reducer(state: StratMapState | undefined, action: Action) {
  return mapReducer(state, action);
}

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

export const selectAllStratMaps = selectAll;
