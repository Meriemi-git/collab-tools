import { createAction, props } from '@ngrx/store';

export const LoadCanvas = createAction(
  '[Canvas] Load Canvas',
  props<{ canvas: unknown }>()
);

export const UpdateDistantCanvas = createAction(
  '[Canvas] Update distant canvas',
  props<{ canvas: unknown }>()
);

export const InitCanvas = createAction(
  '[Canvas] Init Canvas',
  props<{ floorImage: string }>()
);

export const UpdateCanvas = createAction(
  '[Canvas] Update canvas',
  props<{ canvas: unknown }>()
);

export const SetFloorImage = createAction(
  '[Canvas] Set Floor Image',
  props<{ floorImage: string }>()
);

export const UndoCanvasState = createAction('[Canvas] Undo canvas state');

export const RedoCanvasState = createAction('[Canvas] Redo canvas state');

export const ClearCanvasState = createAction('[Canvas] Clear canvas state');

export const AddObjectsToCanvas = createAction(
  '[Canvas] Add Objects to canvas',
  props<{ objects: unknown[] }>()
);

export const RemoveObjectsFromCanvas = createAction(
  '[Canvas] Remove Objects from canvas',
  props<{ guids: string[] }>()
);

export const SetDimensions = createAction(
  '[Canvas] Set dimensions',
  props<{ width: number; height: number }>()
);
