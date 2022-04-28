import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectAll } from '../reducers/user.reducer';
import { UserState } from '../states/user.state';

const userFeature = createFeatureSelector<UserState>('UserState');
export const userState = createSelector(
  userFeature,
  (state: UserState) => state
);
export const getUserInfos = createSelector(
  userState,
  (state: UserState) => state.userInfos
);

export const getAuthError = createSelector(
  userState,
  (state: UserState) => state.error
);

export const getAllUsers = createSelector(userFeature, selectAll);

export const getUserPageMetadata = createSelector(
  userState,
  (state: UserState) => state.pageMetadata
);

export const getUserLocale = createSelector(
  userState,
  (state: UserState) => state.userInfos?.locale
);

export const getSuggestions = createSelector(
  userState,
  (state: UserState) => state.suggestions
);

export const isConfirmed = createSelector(
  userState,
  (state: UserState) => state.userInfos?.confirmed
);

export const canConnectToWebsockets = createSelector(
  userState,
  (state: UserState) => state.canConnectToWebsocket
);
