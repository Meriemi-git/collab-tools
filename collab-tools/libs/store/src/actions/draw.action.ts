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

export const SaveDrawSuccess = createAction(
  '[Draw] Save Draw Success',
  props<{ Draw: Draw }>()
);

export const UpdateDraw = createAction(
  '[Draw] Updating Draw',
  props<{ Draw: Draw }>()
);

export const UpdateDrawSuccess = createAction(
  '[Draw] Update Draw Success',
  props<{ Draw: Draw }>()
);

export const DeleteDraw = createAction(
  '[Draw] Deleting Draw',
  props<{ DrawId: string }>()
);

export const DeleteDrawSuccess = createAction(
  '[Draw] Delete Draw Success',
  props<{ DrawId: string }>()
);

export const LoadDraw = createAction(
  '[Draw] Load Draw',
  props<{ DrawId: string }>()
);

export const LoadDrawSuccess = createAction(
  '[Draw] Load Draw Success',
  props<{ Draw: Draw }>()
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

export const LikeDrawSuccess = createAction(
  '[Draw]  Like Draw Success',
  props<{ Draw: Draw }>()
);

export const DislikeDraw = createAction(
  '[Draw]  Dislike Draw',
  props<{ draw: Draw }>()
);

export const DislikeDrawSuccess = createAction(
  '[Draw]  Dislike Draw Success',
  props<{ draw: Draw }>()
);

export const AttachImage = createAction(
  '[Draw] Attach Image to Draw',
  props<{ imageId: string }>()
);

export const UnAttachImage = createAction(
  '[Draw]  UnAttach Image to Draw',
  props<{ imageId: string }>()
);

export const DiscardCurrentDraw = createAction('[Draw] Discard current Draw');

export const ClearDrawState = createAction('[Draw] Clear Draw state');
