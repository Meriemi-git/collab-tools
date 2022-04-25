import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { NotificationService } from '@collab-tools/services';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as actions from '../actions/notification.action';
import { DisplayMessage } from '../actions/notification.action';
import { NotificationState } from '../states/notifications.state';
@Injectable()
export class NotificationEffect {
  private readonly NOTIFICATION_SERVICE_SUMMARY = 'notification-service';

  constructor(
    private readonly actions$: Actions,
    private readonly notificationService: NotificationService,
    private readonly store: Store<NotificationState>
  ) {}

  getAllNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.GetAllNotifications),
      mergeMap(() =>
        this.notificationService.getAllNotifications().pipe(
          map((notifications) =>
            actions.GetAllNotificationsSuccess({ notifications })
          ),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('notification-service.error.get-all'),
                  titleKey: this.NOTIFICATION_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.NotificationError({ error }));
          })
        )
      )
    )
  );

  deleteNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.DeleteNotification),
      mergeMap((action) =>
        this.notificationService.deleteNotification(action.notificationId).pipe(
          map(() => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('notification-service.success.delete'),
                  titleKey: this.NOTIFICATION_SERVICE_SUMMARY,
                },
              })
            );
            return actions.DeleteNotificationSuccess({
              notificationId: action.notificationId,
            });
          }),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('notification-service.error.delete'),
                  titleKey: this.NOTIFICATION_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.NotificationError({ error }));
          })
        )
      )
    )
  );
}
