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
  on(actions.SaveDrawSuccess, (state, { Draw }) => {
    return adapter.addOne(Draw, {
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
  on(actions.UpdateDrawSuccess, (state, { Draw }) => {
    return adapter.updateOne(
      { id: Draw._id, changes: Draw },
      {
        ...state,
        Draw: Draw,
        error: null,
      }
    );
  }),
  on(actions.DeleteDrawSuccess, (state, { DrawId }) => {
    return adapter.removeOne(DrawId, {
      ...state,
      Draw: null,
      error: null,
    });
  }),
  on(actions.LoadDraw, (state) => ({
    ...state,
    error: null,
  })),
  on(actions.LoadDrawSuccess, (state, { Draw }) => ({
    ...state,
    draw: Draw,
    error: null,
  })),
  on(actions.CreateDraw, (state, { Draw }) => ({
    ...initialstate,
    draw: Draw,
  })),
  on(actions.LikeDraw, (state) => ({
    ...state,
    error: null,
  })),
  on(actions.LikeDrawSuccess, (state, { Draw }) => {
    return adapter.updateOne(
      { id: Draw._id, changes: { votes: Draw.votes + 1 } },
      {
        ...state,
        Draw: Draw,
        error: null,
      }
    );
  }),
  on(actions.DislikeDraw, (state) => ({
    ...state,
    error: null,
  })),
  on(actions.DislikeDrawSuccess, (state, { Draw }) => {
    return adapter.updateOne(
      { id: Draw._id, changes: { votes: Draw.votes - 1 } },
      {
        ...state,
        Draw: Draw,
        error: null,
      }
    );
  }),
  on(actions.UpdateDrawInfos, (state, { name, description, isPublic }) => ({
    ...state,
    draw: {
      ...state.draw,
      name: name,
      description: description,
      isPublic: isPublic,
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
  on(actions.AttachImage, (state, { imageId }) => ({
    ...state,
    draw: {
      ...state.draw,
      attachedImages: addImage(state.draw.attachedImages, imageId),
    },
  })),
  on(actions.UnAttachImage, (state, { imageId }) => ({
    ...state,
    draw: {
      ...state.draw,
      attachedImages: removeImage(state.draw.attachedImages, imageId),
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

function addImage(attachedImages: string[], imageId: string): string[] {
  const copy = Object.assign([], attachedImages);
  if (!copy.some((id) => id === imageId)) {
    copy.push(imageId);
  }
  return copy;
}

function removeImage(attachedImages: string[], imageId: string): string[] {
  const copy = Object.assign([], attachedImages);
  if (copy.some((id) => id === imageId)) {
    return copy.filter((id) => id !== imageId);
  }
}

export function reducer(state: DrawState | undefined, action: Action) {
  return DrawReducer(state, action);
}

export const { selectAll, selectEntities, selectIds, selectTotal } =
  adapter.getSelectors();
