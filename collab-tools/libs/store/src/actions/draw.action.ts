import { HttpErrorResponse } from '@angular/common/http';
import {
  AttributeFilter,
  Draw,
  PageOptions,
  PaginateResult,
} from '@collab-tools/datamodel';
import { createAction, props } from '@ngrx/store';

export const GetDrawsPaginated = createAction(
  '[Draw] Getting My Draw page',
  props<{ pageOptions: PageOptions; DrawFilter: AttributeFilter }>()
);

export const GetDrawsPaginatedSuccess = createAction(
  '[Draw] Get Draw page result Success',
  props<{ pageResults: PaginateResult<Draw> }>()
);

export const DrawError = createAction(
  '[Draw] Get API Draw Error',
  props<{ error: HttpErrorResponse }>()
);

export const CreateDraw = createAction(
  '[Draw] Create Draw',
  props<{ Draw: Draw }>()
);

export const SaveDraw = createAction(
  '[Draw] Saving Draw',
  props<{ Draw: Draw }>()
);

export const SaveDrawsuccess = createAction(
  '[Draw] Save Draw Success',
  props<{ Draw: Draw }>()
);

export const UpdateDraw = createAction(
  '[Draw] Updating Draw',
  props<{ Draw: Draw }>()
);

export const UpdateDrawsuccess = createAction(
  '[Draw] Update Draw Success',
  props<{ Draw: Draw }>()
);

export const DeleteDraw = createAction(
  '[Draw] Deleting Draw',
  props<{ DrawId: string }>()
);

export const DeleteDrawsuccess = createAction(
  '[Draw] Delete Draw Success',
  props<{ DrawId: string }>()
);

export const LoadDraw = createAction(
  '[Draw] Load Draw',
  props<{ DrawId: string }>()
);

export const LoadDrawsuccess = createAction(
  '[Draw] Load Draw success',
  props<{ Draw: Draw }>()
);

export const UpdateDrawLayer = createAction(
  '[Draw] Update Draw layer',
  props<{ layer: Layer }>()
);

export const UpdateDrawInfos = createAction(
  '[Draw] Update Draw Infos',
  props<{ name: string; description: string; isPublic: boolean }>()
);

export const UpdateDrawInfosAndSave = createAction(
  '[Draw] Update Draw Infos and Save',
  props<{ name: string; description: string; isPublic: boolean }>()
);

export const LikeDraw = createAction(
  '[Draw]  Like Draw ',
  props<{ Draw: Draw }>()
);

export const LikeDrawsuccess = createAction(
  '[Draw]  Like Draw Success',
  props<{ Draw: Draw }>()
);

export const DislikeDraw = createAction(
  '[Draw]  Dislike Draw',
  props<{ Draw: Draw }>()
);

export const DislikeDrawsuccess = createAction(
  '[Draw]  Dislike Draw success',
  props<{ Draw: Draw }>()
);

export const AttachImage = createAction(
  '[Draw] Attach Image to Draw',
  props<{ imageId: string }>()
);

export const UnAttachImage = createAction(
  '[Draw]  UnAttach Image to Draw',
  props<{ imageId: string }>()
);

export const SetActiveLayer = createAction(
  '[Draw] Set Active layer',
  props<{ layer: Layer }>()
);

export const SetFirstLayerActive = createAction(
  '[Draw] Set First layer Active'
);

export const SetTacticalMode = createAction(
  '[Draw] Set Tactical Mode',
  props<{ tacticalMode: boolean }>()
);

export const UpdateLayerCanvas = createAction(
  '[Draw] Update layer canvas',
  props<{ canvas: unknown }>()
);

export const DiscardCurrentDraw = createAction('[Draw] Discard current Draw');

export const ClearDrawstate = createAction('[Draw] Clear Draw state');
