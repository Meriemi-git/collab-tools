import { HttpErrorResponse } from '@angular/common/http';
import { EntityState } from '@ngrx/entity';
import { Image } from '@collab-tools/datamodel';
export interface GalleryState extends EntityState<Image> {
  draggedImage: Image;
  draggedImageLink: string;
  error: HttpErrorResponse;
}
