import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { Gadget } from '@collab-tools/datamodel';

export const FetchGadgets = createAction('[Gadget] Fetch Gadgets');

export const FetchGadgetsSuccess = createAction(
  '[Gadget] Fetch Gadgets Success',
  props<{ gadgets: Gadget[] }>()
);

export const GadgetsError = createAction(
  '[Gadget] Gadgets Error',
  props<{ error: HttpErrorResponse }>()
);

export const DragGadget = createAction(
  '[Gadget] Drag Gadget',
  props<{ gadget: Gadget }>()
);

export const DragGadgetSuccess = createAction('[Gadget] Drag Gadget success');

export const AddGadget = createAction(
  '[Gadget] Add Gadget',
  props<{ data: FormData }>()
);

export const AddGadgetSuccess = createAction(
  '[Gadget] Add Gadget Success',
  props<{ gadget: Gadget }>()
);

export const GadgetError = createAction(
  '[Gadget] Gadget Error',
  props<{ error: HttpErrorResponse }>()
);

export const UpdateGadget = createAction(
  '[Gadget] Update Gadget',
  props<{ data: FormData }>()
);

export const UpdateGadgetSuccess = createAction(
  '[Gadget] Update Gadget success',
  props<{ gadget: Gadget }>()
);

export const DeleteGadget = createAction(
  '[Gadget] Delete Gadget',
  props<{ gadgetId: string }>()
);

export const DeleteGadgetSuccess = createAction(
  '[Gadget] Delete Gadget success',
  props<{ gadgetId: string }>()
);
