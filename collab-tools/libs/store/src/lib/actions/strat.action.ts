import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import {
  AttributeFilter,
  Layer,
  PageOptions,
  PaginateResult,
  Strat,
} from '@collab-tools/datamodel';

export const GetStratsPaginated = createAction(
  '[Strats] Getting My Strat page',
  props<{ pageOptions: PageOptions; stratFilter: AttributeFilter }>()
);

export const GetStratsPaginatedSuccess = createAction(
  '[Strats] Get Strat page result Success',
  props<{ pageResults: PaginateResult<Strat> }>()
);

export const StratError = createAction(
  '[Strats] Get API Strat Error',
  props<{ error: HttpErrorResponse }>()
);

export const CreateStrat = createAction(
  '[Strats] Create Strat',
  props<{ strat: Strat }>()
);

export const SaveStrat = createAction(
  '[Strats] Saving Strat',
  props<{ strat: Strat }>()
);

export const SaveStratSuccess = createAction(
  '[Strats] Save Strat Success',
  props<{ strat: Strat }>()
);

export const UpdateStrat = createAction(
  '[Strats] Updating Strat',
  props<{ strat: Strat }>()
);

export const UpdateStratSuccess = createAction(
  '[Strats] Update Strat Success',
  props<{ strat: Strat }>()
);

export const DeleteStrat = createAction(
  '[Strats] Deleting Strat',
  props<{ stratId: string }>()
);

export const DeleteStratSuccess = createAction(
  '[Strats] Delete Strat Success',
  props<{ stratId: string }>()
);

export const LoadStrat = createAction(
  '[Strats] Load Strat',
  props<{ stratId: string }>()
);

export const LoadStratSuccess = createAction(
  '[Strats] Load Strat success',
  props<{ strat: Strat }>()
);

export const UpdateStratLayer = createAction(
  '[Strats] Update Strat layer',
  props<{ layer: Layer }>()
);

export const UpdateStratInfos = createAction(
  '[Strats] Update Strat Infos',
  props<{ name: string; description: string; isPublic: boolean }>()
);

export const UpdateStratInfosAndSave = createAction(
  '[Strats] Update Strat Infos and Save',
  props<{ name: string; description: string; isPublic: boolean }>()
);

export const LikeStrat = createAction(
  '[Strats]  Like Strat ',
  props<{ strat: Strat }>()
);

export const LikeStratSuccess = createAction(
  '[Strats]  Like Strat Success',
  props<{ strat: Strat }>()
);

export const DislikeStrat = createAction(
  '[Strats]  Dislike Strat',
  props<{ strat: Strat }>()
);

export const DislikeStratSuccess = createAction(
  '[Strats]  Dislike Strat success',
  props<{ strat: Strat }>()
);

export const AttachImage = createAction(
  '[Strats] Attach Image to strat',
  props<{ imageId: string }>()
);

export const UnAttachImage = createAction(
  '[Strats]  UnAttach Image to Strat',
  props<{ imageId: string }>()
);

export const SetActiveLayer = createAction(
  '[Strats] Set Active layer',
  props<{ layer: Layer }>()
);

export const SetFirstLayerActive = createAction(
  '[Strats] Set First layer Active'
);

export const SetTacticalMode = createAction(
  '[Strats] Set Tactical Mode',
  props<{ tacticalMode: boolean }>()
);

export const UpdateLayerCanvas = createAction(
  '[Strats] Update layer canvas',
  props<{ canvas: unknown }>()
);

export const DiscardCurrentStrat = createAction(
  '[Strats] Discard current strat'
);

export const ClearStratState = createAction('[Strats] Clear strat state');
