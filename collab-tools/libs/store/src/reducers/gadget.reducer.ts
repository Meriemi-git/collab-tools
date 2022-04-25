import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Gadget } from '@collab-tools/datamodel';
import * as actions from '../actions/gadget.action';
import { GadgetState } from '../states/gadget.state';

export const adapter: EntityAdapter<Gadget> = createEntityAdapter<Gadget>({
  sortComparer: sortByName,
  selectId: (gadget: Gadget) => gadget._id,
});

export function sortByName(a: Gadget, b: Gadget): number {
  return a.name.localeCompare(b.name);
}

export const initialstate: GadgetState = adapter.getInitialState({
  error: null,
  dragged: null,
});

const gadgetReducer = createReducer(
  initialstate,
  on(actions.FetchGadgetsSuccess, (state, { gadgets }) => {
    return adapter.addMany(gadgets, { ...state, loading: false, error: null });
  }),
  on(actions.GadgetError, (state, { error }) => ({
    ...state,
    loaded: false,
    error: error,
  })),
  on(actions.DragGadget, (state, { gadget }) => ({
    ...state,
    dragged: gadget,
  })),
  on(actions.DragGadgetSuccess, (state) => ({
    ...state,
    dragged: null,
  })),
  on(actions.AddGadgetSuccess, (state, { gadget }) => {
    return adapter.addOne(gadget, { ...state, loading: false, error: null });
  }),
  on(actions.UpdateGadgetSuccess, (state, { gadget }) => {
    return adapter.updateOne(
      { id: gadget._id, changes: gadget },
      { ...state, loading: false, error: null }
    );
  }),
  on(actions.DeleteGadgetSuccess, (state, { gadgetId }) => {
    return adapter.removeOne(gadgetId, {
      ...state,
      loading: false,
      error: null,
    });
  })
);

export function reducer(state: GadgetState | undefined, action: Action) {
  return gadgetReducer(state, action);
}

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

export const selectAllGadgets = selectAll;
