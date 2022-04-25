import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { GalleryService } from '@collab-tools/services';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as actions from '../actions/gallery.action';
import { DisplayMessage } from '../actions/notification.action';
import { NotificationState } from '../states/notifications.state';

@Injectable()
export class GalleryEffect {
  private readonly GALLERY_SERVICE_SUMMARY = _('gallery-service.summary');

  constructor(
    private readonly actions$: Actions,
    private readonly galleryService: GalleryService,
    private readonly store: Store<NotificationState>
  ) {}

  getImages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.GetGalleryImages),
      mergeMap(() =>
        this.galleryService.getImages().pipe(
          map((images) => actions.GetGalleryImagesSuccess({ images })),
          catchError((error: HttpErrorResponse) => {
            if (error.status === 412) {
              this.store.dispatch(
                DisplayMessage({
                  message: {
                    level: 'warn',
                    messageKey: _('gallery-service.error.access_confirm_mail'),
                    titleKey: this.GALLERY_SERVICE_SUMMARY,
                  },
                })
              );
            } else {
              this.store.dispatch(
                DisplayMessage({
                  message: {
                    level: 'warn',
                    messageKey: _('gallery-service.error.get-all'),
                    titleKey: this.GALLERY_SERVICE_SUMMARY,
                  },
                })
              );
            }

            return of(actions.GetGalleryImagesError({ error }));
          })
        )
      )
    )
  );

  uploadImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.UploadGalleryImage),
      mergeMap((action) =>
        this.galleryService.uploadImage(action.image).pipe(
          map((image) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('gallery-service.success.upload'),
                  titleKey: this.GALLERY_SERVICE_SUMMARY,
                },
              })
            );
            return actions.UploadGalleryImageSuccess({ image });
          }),
          catchError((error: HttpErrorResponse) => {
            let messageKey: string;
            if (error.status === 467) {
              messageKey = _('gallery-service.error.upload.image-missing');
            } else {
              messageKey = _('gallery-service.error.upload.failed');
            }
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey,
                  titleKey: this.GALLERY_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.UploadGalleryImageError({ error }));
          })
        )
      )
    )
  );

  deleteImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.DeleteGalleryImage),
      mergeMap((action) =>
        this.galleryService.deleteImage(action.deleted).pipe(
          map(() => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('gallery-service.success.delete'),
                  titleKey: this.GALLERY_SERVICE_SUMMARY,
                },
              })
            );
            return actions.DeleteGalleryImageSuccess({ image: action.deleted });
          }),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('gallery-service.error.delete'),
                  titleKey: this.GALLERY_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.UploadGalleryImageError({ error }));
          })
        )
      )
    )
  );
}
