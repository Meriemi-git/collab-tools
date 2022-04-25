import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { Image } from '@collab-tools/datamodel';

export const GetGalleryImages = createAction('[Gallery] Get Gallery Image');

export const GetGalleryImagesSuccess = createAction(
  '[Gallery] Get Gallery Image Success',
  props<{ images: Image[] }>()
);

export const GetGalleryImagesError = createAction(
  '[Gallery] Get Gallery Image Error',
  props<{ error: HttpErrorResponse }>()
);

export const UploadGalleryImage = createAction(
  '[Gallery] Upload Gallery Image',
  props<{ image: File }>()
);

export const UploadGalleryImageSuccess = createAction(
  '[Gallery] Upload Gallery Image Success',
  props<{ image: Image }>()
);

export const UploadGalleryImageError = createAction(
  '[Gallery] Upload Gallery Image Error',
  props<{ error: HttpErrorResponse }>()
);

export const DragImage = createAction(
  '[Gallery] Drag image',
  props<{ image: Image }>()
);

export const DragImageSuccess = createAction('[Gallery] Drag image success');

export const DragImageLink = createAction(
  '[Gallery] Drag image link',
  props<{ link: string }>()
);

export const DragImageLinkSuccess = createAction(
  '[Gallery] Drag image link success'
);

export const DeleteGalleryImage = createAction(
  '[Gallery] Delete Gallery Image',
  props<{ deleted: Image }>()
);

export const DeleteGalleryImageSuccess = createAction(
  '[Gallery] Delete Gallery Image Success',
  props<{ image: Image }>()
);
