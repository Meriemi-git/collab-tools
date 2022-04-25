import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CanvasAndAction } from '@collab-tools/datamodel';
import { CanvasState } from '../states/canvas.state';

const canvasFeature = createFeatureSelector<CanvasState>('CanvasState');

export const getCanvasState = createSelector(
  canvasFeature,
  (state: CanvasState) => state
);

export const getCanvas = createSelector(
  getCanvasState,
  (state: CanvasState) => state.canvas
);

export const getFloorImage = createSelector(
  getCanvasState,
  (state: CanvasState) => state.floorImage
);

export const getDistantCanvas = createSelector(
  getCanvasState,
  (state: CanvasState) => state.distantCanvas
);

export const getCanvasAndAction = createSelector(
  getCanvasState,
  (state: CanvasState) =>
    ({
      canvas: state.canvas,
      action: state.action,
    } as CanvasAndAction)
);

export const getObjectsToAdd = createSelector(
  getCanvasState,
  (state: CanvasState) => state.objectsToAdd
);

export const getObjectsToRemove = createSelector(
  getCanvasState,
  (state: CanvasState) => state.objectGuidsToRemove
);

export const getDistantCanavasDimensions = createSelector(
  getCanvasState,
  (state: CanvasState) => ({
    width: state.distantCanvasWidth,
    height: state.distantCanvasHeight,
  })
);
