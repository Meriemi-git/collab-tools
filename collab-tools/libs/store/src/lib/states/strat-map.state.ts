import { HttpErrorResponse } from '@angular/common/http';
import { EntityState } from '@ngrx/entity';
import { StratMap } from '@collab-tools/datamodel';

export interface StratMapState extends EntityState<StratMap> {
  error: HttpErrorResponse;
  selectedStratMap: StratMap;
}
