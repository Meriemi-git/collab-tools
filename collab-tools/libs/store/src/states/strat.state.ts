import { HttpErrorResponse } from '@angular/common/http';
import { EntityState } from '@ngrx/entity';
import {
  Layer,
  PageMetadata,
  PageOptions,
  Strat,
} from '@collab-tools/datamodel';

export interface StratState extends EntityState<Strat> {
  error: HttpErrorResponse;
  strat: Strat;
  pageMetadata: PageMetadata;
  pageOptions: PageOptions;
  activeLayer: Layer;
}
