import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { Floor, StratMap } from '@collab-tools/datamodel';

export const FetchStratMaps = createAction('[Map] Fetch Strat Maps');

export const FetchStratMapsSuccess = createAction(
  '[StratMap] Fetch Strat Maps Success',
  props<{ stratMaps: StratMap[] }>()
);

export const SelectStratMap = createAction(
  '[StratMap] Select Strat Map',
  props<{ stratMap: StratMap }>()
);

export const ClearStratMapState = createAction('[Map] Clear Strat Map state');

export const AddStratMap = createAction(
  '[StratMap] Add StratMap',
  props<{ data: FormData }>()
);

export const AddStratMapSuccess = createAction(
  '[StratMap] Add StratMap Success',
  props<{ stratMap: StratMap }>()
);

export const StratMapError = createAction(
  '[StratMap] StratMap Error',
  props<{ error: HttpErrorResponse }>()
);

export const UpdateStratMap = createAction(
  '[StratMap] Update StratMap',
  props<{ data: FormData }>()
);

export const UpdateStratMapSuccess = createAction(
  '[StratMap] Update StratMap success',
  props<{ stratMap: StratMap }>()
);

export const DeleteStratMap = createAction(
  '[StratMap] Delete StratMap',
  props<{ stratMapId: string }>()
);

export const DeleteStratMapSuccess = createAction(
  '[StratMap] Delete StratMap success',
  props<{ stratMapId: string }>()
);

export const UpdateStratMapFloors = createAction(
  '[StratMap] Update StratMap Floors',
  props<{ mapId: string; floors: Floor[] }>()
);

export const AddFloor = createAction(
  '[StratMap] Add StratMap Floor',
  props<{ mapId: string; data: FormData }>()
);

export const AddFloorSuccess = createAction(
  '[StratMap] Add StratMap Floor Success',
  props<{ stratMap: StratMap }>()
);

export const UpdateFloor = createAction(
  '[StratMap] Update StratMap Floor',
  props<{ mapId: string; data: FormData }>()
);

export const UpdateFloorSuccess = createAction(
  '[StratMap] Update StratMap Floor Success',
  props<{ stratMap: StratMap }>()
);

export const DeleteFloor = createAction(
  '[StratMap] Delete StratMap Floor',
  props<{ mapId: string; floorId: string }>()
);

export const DeleteFloorSuccess = createAction(
  '[StratMap] Delete StratMap Floor success',
  props<{ stratMap: StratMap }>()
);
