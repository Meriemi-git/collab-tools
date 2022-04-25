import { HttpErrorResponse } from '@angular/common/http';
import { Draw, PageMetadata, PageOptions } from '@collab-tools/datamodel';
import { EntityState } from '@ngrx/entity';

export interface DrawState extends EntityState<Draw> {
  error: HttpErrorResponse;
  draw: Draw;
  pageMetadata: PageMetadata;
  pageOptions: PageOptions;
}
