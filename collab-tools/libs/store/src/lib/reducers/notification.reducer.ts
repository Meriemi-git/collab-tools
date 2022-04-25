import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Notification } from '@collab-tools/datamodel';
import * as actions from '../actions/notification.action';
import { NotificationState } from '../states/notifications.state';

export const adapter: EntityAdapter<Notification> =
  createEntityAdapter<Notification>({
    sortComparer: sortByDate,
    selectId: (notification: Notification) => notification._id,
  });

export function sortByDate(a: Notification, b: Notification): number {
  return a.createdAt.getTime() - b.createdAt.getTime();
}

export const initialstate: NotificationState = adapter.getInitialState({
  toBeDisplayed: null,
  error: null,
});

const notifReducer = createReducer(
  initialstate,
  on(actions.DisplayMessage, (state, { message }) => ({
    ...state,
    toBeDisplayed: message,
  })),
  on(actions.AddNotification, (state, { notification }) => {
    return adapter.addOne(notification, { ...state, error: null });
  }),
  on(actions.GetAllNotificationsSuccess, (state, { notifications }) => {
    return adapter.addMany(notifications, { ...state, error: null });
  }),
  on(actions.DeleteNotificationSuccess, (state, { notificationId }) => {
    return adapter.removeOne(notificationId, { ...state, error: null });
  }),
  on(actions.NotificationError, (state, { error }) => ({
    ...state,
    error: error,
  }))
);

export function reducer(state: NotificationState | undefined, action: Action) {
  return notifReducer(state, action);
}

export const { selectAll, selectEntities, selectIds, selectTotal } =
  adapter.getSelectors();
