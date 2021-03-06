import { CanvasActions } from '@collab-tools/datamodel';

export interface CanvasState {
  history: unknown[];
  historyIndex: number;
  canvas: unknown;
  action: CanvasActions;
  distantCanvasWidth: number;
  distantCanvasHeight: number;
  distantCanvas: unknown;
  objectsToAdd: unknown[];
  objectGuidsToRemove: string[];
}
