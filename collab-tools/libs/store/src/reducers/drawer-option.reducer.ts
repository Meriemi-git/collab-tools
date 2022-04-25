import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { DrawerOption, DrawerOptionName } from '@collab-tools/datamodel';
import * as actions from '../actions/drawer-option.action';
import { DrawerOptionState } from '../states/drawer-option.state';

export const adapter: EntityAdapter<DrawerOption> = createEntityAdapter<DrawerOption>(
  {
    sortComparer: sortByName,
    selectId: (option: DrawerOption) => option.name,
  }
);

export function sortByName(a: DrawerOption, b: DrawerOption): number {
  return a.name.localeCompare(b.name);
}

export const initialstate: DrawerOptionState = adapter.getInitialState({
  selectedOption: null,
});

const drawingActionReducer = createReducer(
  initialstate,
  on(actions.FeedDrawerOptions, (state, { drawerOptions }) => {
    return adapter.addMany(drawerOptions, {
      ...state,
    });
  }),
  on(actions.SetFillColor, (state, { colorValue }) => {
    return adapter.updateOne(
      {
        id: DrawerOptionName.FILL_COLOR,
        changes: { value: colorValue, active: true },
      },
      {
        ...state,
      }
    );
  }),
  on(actions.SetStrokeColor, (state, { colorValue }) => {
    return adapter.updateOne(
      {
        id: DrawerOptionName.STROKE_COLOR,
        changes: { value: colorValue, active: true },
      },
      {
        ...state,
      }
    );
  }),
  on(actions.SetStrokeWidth, (state, { width }) => {
    return adapter.updateOne(
      {
        id: DrawerOptionName.STROKE_WIDTH,
        changes: { value: width, active: true },
      },
      {
        ...state,
      }
    );
  }),

  on(actions.SetOptionInactive, (state, { name }) => {
    return adapter.updateOne(
      {
        id: name,
        changes: { active: false },
      },
      {
        ...state,
      }
    );
  }),
  on(actions.ToogleDrawerOptionActivation, (state, { option }) => {
    const isActive: boolean = option.active;
    return adapter.updateOne(
      {
        id: option.name,
        changes: { active: !isActive },
      },
      {
        ...state,
      }
    );
  })
);

export function reducer(state: DrawerOptionState | undefined, action: Action) {
  return drawingActionReducer(state, action);
}

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();

export const selectAllActions = selectAll;
