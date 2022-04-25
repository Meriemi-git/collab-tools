import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectAll, selectTotal } from '../reducers/notification.reducer';
import { NotificationState } from '../states/notifications.state';

const notifFeature =
  createFeatureSelector<NotificationState>('NotificationState');

export const getAllNotifications = createSelector(notifFeature, selectAll);
export const getNumberOfNotifs = createSelector(notifFeature, selectTotal);

export const getMessage = createSelector(
  notifFeature,
  (state: NotificationState) => state.toBeDisplayed
);
