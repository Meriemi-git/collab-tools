import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { DrawerAction } from '@collab-tools/datamodel';
import * as actions from '../actions/drawer-action.action';
import { DrawerActionState } from '../states/drawer-action.state';

export const adapter: EntityAdapter<DrawerAction> = createEntityAdapter<DrawerAction>(
  {
    sortComparer: sortByName,
    selectId: (action: DrawerAction) => action.name,
  }
);

export function sortByName(a: DrawerAction, b: DrawerAction): number {
  return a.name.localeCompare(b.name);
}

export const initialstate: DrawerActionState = adapter.getInitialState({
  selectedAction: null,
  drawingMode: null,
});

const drawingActionReducer = createReducer(
  initialstate,
  on(actions.FeedDrawerActions, (state, { drawingActions }) => {
    return adapter.addMany(drawingActions, {
      ...state,
    });
  }),
  on(actions.SetDrawerAction, (state, { action }) => {
    const updates: DrawerAction[] = [];
    const active = adapter
      .getSelectors()
      .selectAll(state)
      .find((a) => a.active);
    if (active) {
      const inactive = Object.assign({}, active, {
        active: false,
      });
      updates.push(inactive);
    }

    const newActive = Object.assign({}, action, {
      active: true,
    });

    updates.push(newActive);
    const updatedActions = updates.map((updatedAction) => {
      return { id: updatedAction.name, changes: updatedAction };
    });
    return adapter.updateMany(updatedActions, {
      ...state,
      selectedAction: newActive,
    });
  }),
  on(actions.UnSelectDrawerAction, (state) => {
    const updatedActions = adapter
      .getSelectors()
      .selectAll(state)
      .map((someAction) => {
        const updatedAction = Object.assign({}, someAction, {
          active: false,
        });
        return { id: updatedAction.name, changes: updatedAction };
      });
    return adapter.updateMany(updatedActions, {
      ...state,
      selectedAction: adapter
        .getSelectors()
        .selectAll(state)
        .find((action) => action.name === 'selection'),
    });
  }),
  on(actions.SetDrawingMode, (state, { drawingMode }) => ({
    ...state,
    drawingMode: drawingMode,
  }))
);

export function reducer(state: DrawerActionState | undefined, action: Action) {
  return drawingActionReducer(state, action);
}

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

export const selectAllActions = selectAll;
