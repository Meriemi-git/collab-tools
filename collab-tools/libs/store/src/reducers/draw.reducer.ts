import { Draw } from '@collab-tools/datamodel';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as actions from '../actions/draw.action';
import { DrawState } from '../states/draw.state';

export const adapter: EntityAdapter<Draw> = createEntityAdapter<Draw>({
  sortComparer: sortByName,
  selectId: (draw: Draw) => draw._id,
});

export function sortByName(a: Draw, b: Draw): number {
  return a.name.localeCompare(b.name);
}

export const initialstate: DrawState = adapter.getInitialState({
  error: null,
  draw: null,
  pageMetadata: null,
  pageOptions: {
    limit: 10,
    page: 1,
    sortedBy: 'name',
    order: 'asc',
  },
});

const DrawReducer = createReducer(
  initialstate,
  on(actions.GetDrawsPaginatedSuccess, (state, { pageResults }) => {
    return adapter.setAll(pageResults.docs, {
      ...state,
      pageMetadata: {
        totalDocs: pageResults.totalDocs,
        limit: pageResults.limit,
        totalPages: pageResults.totalPages,
        page: pageResults.page,
        pagingCounter: pageResults.pagingCounter,
        hasPrevPage: pageResults.hasPrevPage,
        hasNextPage: pageResults.hasNextPage,
        prevPage: pageResults.prevPage,
        nextPage: pageResults.nextPage,
      },
      error: null,
    });
  }),
  on(actions.SaveDraw, (state) => ({
    ...state,
    error: null,
  })),
  on(actions.SaveDrawSuccess, (state, { draw }) => {
    return adapter.addOne(draw, {
      ...state,
      error: null,
      Draw: Draw,
    });
  }),
  on(actions.DrawError, (state, { error }) => ({
    ...state,
    error: error,
  })),
  on(actions.UpdateDraw, (state) => ({
    ...state,
    error: null,
  })),
  on(actions.UpdateDrawSuccess, (state, { draw }) => {
    return adapter.updateOne(
      { id: draw._id, changes: draw },
      {
        ...state,
        draw,
        error: null,
      }
    );
  }),
  on(actions.DeleteDrawSuccess, (state, { drawId }) => {
    return adapter.removeOne(drawId, {
      ...state,
      Draw: null,
      error: null,
    });
  }),
  on(actions.LoadDraw, (state) => ({
    ...state,
    error: null,
  })),
  on(actions.LoadDrawSuccess, (state, { draw }) => ({
    ...state,
    draw,
    error: null,
  })),
  on(actions.CreateDraw, (state, { draw }) => ({
    ...initialstate,
    draw,
  })),
  on(actions.UpdateDrawInfos, (state, { name, description }) => ({
    ...state,
    draw: {
      ...state.draw,
      name: name,
      description: description,
    },
  })),
  on(
    actions.UpdateDrawInfosAndSave,
    (state, { name, description, isPublic }) => ({
      ...state,
      draw: {
        ...state.draw,
        name: name,
        description: description,
        isPublic: isPublic,
      },
    })
  ),
  on(actions.UpdateDrawCanvas, (state, { canvas }) => ({
    ...state,
    draw: {
      ...state.draw,
      canvas: canvas,
    },
  })),
  on(actions.DiscardCurrentDraw, (state) => ({
    ...state,
    draw: null,
  })),
  on(actions.ClearDrawState, (state) => ({
    ...state,
    error: null,
    draw: null,
    layer: null,
  }))
);

export function reducer(state: DrawState | undefined, action: Action) {
  return DrawReducer(state, action);
}

export const { selectAll, selectEntities, selectIds, selectTotal } =
  adapter.getSelectors();
