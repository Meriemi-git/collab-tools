import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { GadgetService } from '@collab-tools/services';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as actions from '../actions/gadget.action';
import { DisplayMessage } from '../actions/notification.action';
import { NotificationState } from '../states/notifications.state';

@Injectable()
export class GadgetEffect {
  private readonly GADGET_SERVICE_SUMMARY = _('gadget-service.summary');

  constructor(
    private readonly actions$: Actions,
    private readonly gadgetService: GadgetService,
    private readonly store: Store<NotificationState>
  ) {}

  getAllGadgets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.FetchGadgets),
      mergeMap(() =>
        this.gadgetService.getAllGadgets().pipe(
          map((gadgets) => actions.FetchGadgetsSuccess({ gadgets })),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('gadget-service.error.get-all'),
                  titleKey: this.GADGET_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.GadgetError({ error }));
          })
        )
      )
    )
  );

  addGadget$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.AddGadget),
      mergeMap((action) =>
        this.gadgetService.addGadget(action.data).pipe(
          map((gadget) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('gadget-service.success.add'),
                  titleKey: this.GADGET_SERVICE_SUMMARY,
                },
              })
            );
            return actions.AddGadgetSuccess({ gadget });
          }),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('gadget-service.error.add'),
                  titleKey: this.GADGET_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.GadgetError({ error }));
          })
        )
      )
    )
  );

  updateGadget$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.UpdateGadget),
      mergeMap((action) =>
        this.gadgetService.updateGadget(action.data).pipe(
          map((gadget) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('gadget-service.success.update'),
                  titleKey: this.GADGET_SERVICE_SUMMARY,
                },
              })
            );
            return actions.UpdateGadgetSuccess({ gadget });
          }),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('gadget-service.error.update'),
                  titleKey: this.GADGET_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.GadgetError({ error }));
          })
        )
      )
    )
  );

  deleteGadget$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.DeleteGadget),
      mergeMap((action) =>
        this.gadgetService.deleteGadget(action.gadgetId).pipe(
          map(() => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('gadget-service.success.delete'),
                  titleKey: this.GADGET_SERVICE_SUMMARY,
                },
              })
            );
            return actions.DeleteGadgetSuccess({ gadgetId: action.gadgetId });
          }),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('gadget-service.error.delete'),
                  titleKey: this.GADGET_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.GadgetError({ error }));
          })
        )
      )
    )
  );
}
