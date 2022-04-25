import { Action, createReducer, on } from '@ngrx/store';
import { CanvasActions } from '@collab-tools/datamodel';
import * as actions from '../actions/canvas.action';
import { CanvasState } from '../states/canvas.state';

export const initialstate: CanvasState = {
  history: [],
  canvas: null,
  historyIndex: -1,
  floorImage: null,
  action: null,
  distantCanvas: null,
  objectsToAdd: [],
  objectGuidsToRemove: [],
  distantCanvasWidth: null,
  distantCanvasHeight: null,
};

const drawingActionReducer = createReducer(
  initialstate,
  on(actions.InitCanvas, (state, { floorImage }) => ({
    ...state,
    floorImage: floorImage,
    action: CanvasActions.INIT_CANVAS,
  })),
  on(actions.LoadCanvas, (state, { canvas }) => ({
    ...state,
    historyIndex: 0,
    history: [canvas],
    canvas: canvas,
    action: CanvasActions.LOAD_CANVAS,
  })),
  on(actions.UpdateCanvas, (state, { canvas }) => ({
    ...state,
    historyIndex: state.historyIndex + 1,
    history: [...state.history.slice(0, state.historyIndex + 1), canvas],
    canvas: canvas,
    ignore: true,
    action: CanvasActions.UPDATE_CANVAS,
  })),
  on(actions.UndoCanvasState, (state) => ({
    ...state,
    historyIndex:
      state.historyIndex > 0 ? state.historyIndex - 1 : state.historyIndex,
    canvas:
      state.historyIndex > 0 && state.history.length > 0
        ? state.history[state.historyIndex - 1]
        : state.canvas,
    action: CanvasActions.UNDO_CANVAS,
  })),
  on(actions.RedoCanvasState, (state) => ({
    ...state,
    historyIndex:
      state.history.length > state.historyIndex + 1
        ? state.historyIndex + 1
        : state.historyIndex,
    canvas:
      state.history.length > state.historyIndex + 1 && state.history.length > 0
        ? state.history[state.historyIndex + 1]
        : state.canvas,
    action: CanvasActions.REDO_CANVAS,
  })),
  on(actions.SetFloorImage, (state, { floorImage }) => ({
    ...state,
    floorImage: floorImage,
    action: CanvasActions.SET_FLOOR_IMAGE,
  })),
  on(actions.UpdateDistantCanvas, (state, { canvas }) => ({
    ...state,
    distantCanvas: canvas,
  })),
  on(actions.AddObjectsToCanvas, (state, { objects }) => ({
    ...state,
    objectsToAdd: objects,
  })),
  on(actions.RemoveObjectsFromCanvas, (state, { guids }) => ({
    ...state,
    objectGuidsToRemove: guids,
  })),
  on(actions.SetDimensions, (state, { width, height }) => ({
    ...state,
    distantCanvasHeight: height,
    distantCanvasWidth: width,
  })),
  on(actions.ClearCanvasState, () => ({
    ...initialstate,
  }))
);

export function reducer(state: CanvasState | undefined, action: Action) {
  return drawingActionReducer(state, action);
}
