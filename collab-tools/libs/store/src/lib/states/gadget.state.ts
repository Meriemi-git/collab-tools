import { HttpErrorResponse } from '@angular/common/http';
import { EntityState } from '@ngrx/entity';
import { Gadget } from '@collab-tools/datamodel';

export interface GadgetState extends EntityState<Gadget> {
  error: HttpErrorResponse;
  dragged: Gadget;
}
