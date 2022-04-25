import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Layer, Strat } from '@collab-tools/datamodel';
import * as actions from '../actions/strat.action';
import { StratState } from '../states/strat.state';

export const adapter: EntityAdapter<Strat> = createEntityAdapter<Strat>({
  sortComparer: sortByName,
  selectId: (strat: Strat) => strat._id,
});

export function sortByName(a: Strat, b: Strat): number {
  return a.name.localeCompare(b.name);
}

export const initialstate: StratState = adapter.getInitialState({
  error: null,
  strat: null,
  pageMetadata: null,
  pageOptions: {
    limit: 10,
    page: 1,
    sortedBy: 'name',
    order: 'asc',
  },
  activeLayer: null,
});

const stratReducer = createReducer(
  initialstate,
  on(actions.GetStratsPaginatedSuccess, (state, { pageResults }) => {
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
  on(actions.SaveStrat, (state) => ({
    ...state,
    error: null,
  })),
  on(actions.SaveStratSuccess, (state, { strat }) => {
    return adapter.addOne(strat, {
      ...state,
      error: null,
      strat: strat,
    });
  }),
  on(actions.StratError, (state, { error }) => ({
    ...state,
    error: error,
  })),
  on(actions.UpdateStrat, (state) => ({
    ...state,
    error: null,
  })),
  on(actions.UpdateStratSuccess, (state, { strat }) => {
    return adapter.updateOne(
      { id: strat._id, changes: strat },
      {
        ...state,
        strat: strat,
        error: null,
      }
    );
  }),
  on(actions.DeleteStratSuccess, (state, { stratId }) => {
    return adapter.removeOne(stratId, {
      ...state,
      strat: null,
      error: null,
    });
  }),
  on(actions.LoadStrat, (state) => ({
    ...state,
    error: null,
  })),
  on(actions.LoadStratSuccess, (state, { strat }) => ({
    ...state,
    strat: strat,
    error: null,
  })),
  on(actions.CreateStrat, (state, { strat }) => ({
    ...initialstate,
    strat: strat,
  })),
  on(actions.LikeStrat, (state) => ({
    ...state,
    error: null,
  })),
  on(actions.LikeStratSuccess, (state, { strat }) => {
    return adapter.updateOne(
      { id: strat._id, changes: { votes: strat.votes + 1 } },
      {
        ...state,
        strat: strat,
        error: null,
      }
    );
  }),
  on(actions.DislikeStrat, (state) => ({
    ...state,
    error: null,
  })),
  on(actions.DislikeStratSuccess, (state, { strat }) => {
    return adapter.updateOne(
      { id: strat._id, changes: { votes: strat.votes - 1 } },
      {
        ...state,
        strat: strat,
        error: null,
      }
    );
  }),
  on(actions.UpdateStratInfos, (state, { name, description, isPublic }) => ({
    ...state,
    strat: {
      ...state.strat,
      name: name,
      description: description,
      isPublic: isPublic,
    },
  })),
  on(
    actions.UpdateStratInfosAndSave,
    (state, { name, description, isPublic }) => ({
      ...state,
      strat: {
        ...state.strat,
        name: name,
        description: description,
        isPublic: isPublic,
      },
    })
  ),
  on(actions.UpdateStratLayer, (state, { layer }) => ({
    ...state,
    strat: {
      ...state.strat,
      layers: [
        ...state.strat?.layers.filter((l) => l.floor._id !== layer.floor._id),
        layer,
      ],
    },
  })),
  on(actions.AttachImage, (state, { imageId }) => ({
    ...state,
    strat: {
      ...state.strat,
      attachedImages: addImage(state.strat.attachedImages, imageId),
    },
  })),
  on(actions.UnAttachImage, (state, { imageId }) => ({
    ...state,
    strat: {
      ...state.strat,
      attachedImages: removeImage(state.strat.attachedImages, imageId),
    },
  })),
  on(actions.SetActiveLayer, (state, { layer }) => ({
    ...state,
    activeLayer: layer,
  })),
  on(actions.SetFirstLayerActive, (state) => ({
    ...state,
    activeLayer: state.strat.layers[0],
  })),
  on(actions.SetTacticalMode, (state, { tacticalMode }) => ({
    ...state,
    activeLayer: {
      ...state.activeLayer,
      tacticalMode: tacticalMode,
    },
    strat: {
      ...state.strat,
      layers: updateRightLayerAttribute(
        state.strat?.layers,
        state.activeLayer,
        'tacticalMode',
        tacticalMode
      ),
    },
  })),
  on(actions.UpdateLayerCanvas, (state, { canvas }) => ({
    ...state,
    activeLayer: {
      ...state.activeLayer,
      canvas: canvas,
    },
    strat: {
      ...state.strat,
      layers: updateRightLayerAttribute(
        state.strat?.layers,
        state.activeLayer,
        'canvas',
        canvas
      ),
    },
  })),
  on(actions.DiscardCurrentStrat, (state) => ({
    ...state,
    strat: null,
  })),
  on(actions.ClearStratState, (state) => ({
    ...state,
    error: null,
    strat: null,
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

function updateRightLayerAttribute(
  layers: Layer[],
  activeLayer: Layer,
  attributeName: string,
  attributeValue: unknown
): Layer[] {
  return layers?.map((layer) => {
    if (layer.floor._id === activeLayer.floor._id) {
      const updatedLayer = Object.assign({}, layer);
      updatedLayer[attributeName] = attributeValue;
      return updatedLayer;
    } else {
      return layer;
    }
  });
}

export function reducer(state: StratState | undefined, action: Action) {
  return stratReducer(state, action);
}

export const { selectAll, selectEntities, selectIds, selectTotal } =
  adapter.getSelectors();
