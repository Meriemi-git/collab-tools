import { HttpErrorResponse } from '@angular/common/http';
import { Draw, PageOptions, PaginateResult } from '@collab-tools/datamodel';
import { createAction, props } from '@ngrx/store';

export const GetDrawsPaginated = createAction(
  '[Draw] Getting My Draw page',
  props<{ pageOptions: PageOptions }>()
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
  props<{ draw: Draw }>()
);

export const SaveDraw = createAction(
  '[Draw] Saving Draw',
  props<{ draw: Draw }>()
);

export const SaveDrawSuccess = createAction(
  '[Draw] Save Draw Success',
  props<{ draw: Draw }>()
);

export const UpdateDraw = createAction(
  '[Draw] Updating Draw',
  props<{ draw: Draw }>()
);

export const UpdateDrawSuccess = createAction(
  '[Draw] Update Draw Success',
  props<{ draw: Draw }>()
);

export const DeleteDraw = createAction(
  '[Draw] Deleting Draw',
  props<{ drawId: string }>()
);

export const DeleteDrawSuccess = createAction(
  '[Draw] Delete Draw Success',
  props<{ drawId: string }>()
);

export const LoadDraw = createAction(
  '[Draw] Load Draw',
  props<{ drawId: string }>()
);

export const LoadDrawSuccess = createAction(
  '[Draw] Load Draw Success',
  props<{ draw: Draw }>()
);

export const UpdateDrawInfos = createAction(
  '[Draw] Update Draw Infos',
  props<{ name: string; description: string; isPublic: boolean }>()
);

export const UpdateDrawInfosAndSave = createAction(
  '[Draw] Update Draw Infos and Save',
  props<{ name: string; description: string; isPublic: boolean }>()
);

export const AttachImage = createAction(
  '[Draw] Attach Image to Draw',
  props<{ imageId: string }>()
);

export const UpdateDrawCanvas = createAction(
  '[Draws] Update draw canvas',
  props<{ canvas: unknown }>()
);

export const UnAttachImage = createAction(
  '[Draw]  UnAttach Image to Draw',
  props<{ imageId: string }>()
);

export const DiscardCurrentDraw = createAction('[Draw] Discard current Draw');

export const ClearDrawState = createAction('[Draw] Clear Draw state');
