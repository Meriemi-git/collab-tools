import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { Notification, TranslateMessage } from '@collab-tools/datamodel';

export const DisplayMessage = createAction(
  '[Notification] Display message',
  props<{ message: TranslateMessage }>()
);

export const GetAllNotifications = createAction(
  '[Notification] Get all notifications'
);

export const GetAllNotificationsSuccess = createAction(
  '[Notification] Get all notifications success',
  props<{ notifications: Notification[] }>()
);

export const AddNotification = createAction(
  '[Notification] Add notification',
  props<{ notification: Notification }>()
);

export const DeleteNotification = createAction(
  '[Notification] Delete notification',
  props<{ notificationId: string }>()
);

export const DeleteNotificationSuccess = createAction(
  '[Notification] Delete notification Success',
  props<{ notificationId: string }>()
);

export const NotificationError = createAction(
  '[Notification] Notification Error',
  props<{ error: HttpErrorResponse }>()
);
