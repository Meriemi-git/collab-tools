import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { DrawService } from '@collab-tools/services';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { ClearCanvasState } from '../actions/canvas.action';
import {
  ClearDrawState,
  DeleteDraw,
  DeleteDrawSuccess,
  DrawError,
  GetDrawsPaginated,
  GetDrawsPaginatedSuccess,
  LoadDraw,
  LoadDrawSuccess,
  SaveDraw,
  SaveDrawSuccess,
  UpdateDraw,
  UpdateDrawInfosAndSave,
  UpdateDrawSuccess,
} from '../actions/draw.action';
import { DisplayMessage } from '../actions/notification.action';
import { CollabToolsState } from '../reducers';
import { getDraw } from '../selectors/draw.selector';

@Injectable()
export class DrawEffect {
  private readonly DRAW_SERVICE_SUMMARY_KEY = _('draw-service.summary');

  constructor(
    private readonly actions$: Actions,
    private readonly drawService: DrawService,
    private readonly store: Store<CollabToolsState>
  ) {}

  afterUpdateDrawInfos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UpdateDrawInfosAndSave),
      switchMap(() => this.store.select(getDraw).pipe(take(1))),
      mergeMap((draw) => {
        if (draw._id) {
          return of(UpdateDraw({ draw }));
        } else {
          return of(SaveDraw({ draw }));
        }
      })
    )
  );

  afterDeletingDraw$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeleteDrawSuccess),
      switchMap(() => [ClearDrawState(), ClearCanvasState()])
    )
  );

  getDrawsPaginated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GetDrawsPaginated),
      mergeMap((action) =>
        this.drawService.getDrawsPaginated(action.pageOptions).pipe(
          map((pageResults) => GetDrawsPaginatedSuccess({ pageResults })),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('draw-service.error.get-all'),
                  titleKey: this.DRAW_SERVICE_SUMMARY_KEY,
                },
              })
            );
            return of(DrawError({ error }));
          })
        )
      )
    )
  );

  loadDrawById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadDraw),
      mergeMap((action) =>
        this.drawService.loadDrawById(action.drawId).pipe(
          map((draw) => LoadDrawSuccess({ draw })),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('draw-service.error.load'),
                  titleKey: this.DRAW_SERVICE_SUMMARY_KEY,
                },
              })
            );
            return of(DrawError({ error }));
          })
        )
      )
    )
  );

  saveDraw$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SaveDraw),
      mergeMap((action) =>
        this.drawService.saveDraw(action.draw).pipe(
          map((draw) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('draw-service.success.save'),
                  titleKey: this.DRAW_SERVICE_SUMMARY_KEY,
                },
              })
            );
            return SaveDrawSuccess({ draw });
          }),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('draw-service.error.save'),
                  titleKey: this.DRAW_SERVICE_SUMMARY_KEY,
                },
              })
            );
            return of(DrawError({ error }));
          })
        )
      )
    )
  );

  updateDraw$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UpdateDraw),
      mergeMap((action) =>
        this.drawService.updateDraw(action.draw).pipe(
          map((draw) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('draw-service.success.update'),
                  titleKey: this.DRAW_SERVICE_SUMMARY_KEY,
                },
              })
            );
            return UpdateDrawSuccess({ draw });
          }),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('draw-service.error.update'),
                  titleKey: this.DRAW_SERVICE_SUMMARY_KEY,
                },
              })
            );
            return of(DrawError({ error }));
          })
        )
      )
    )
  );

  deleteDraw$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeleteDraw),
      mergeMap((action) =>
        this.drawService.deleteDraw(action.drawId).pipe(
          map(() => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('draw-service.success.delete'),
                  titleKey: this.DRAW_SERVICE_SUMMARY_KEY,
                },
              })
            );
            return DeleteDrawSuccess({ drawId: action.drawId });
          }),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('draw-service.error.delete'),
                  titleKey: this.DRAW_SERVICE_SUMMARY_KEY,
                },
              })
            );
            return of(DrawError({ error }));
          })
        )
      )
    )
  );
}
