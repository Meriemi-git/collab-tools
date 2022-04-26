import { UserDto } from '@collab-tools/datamodel';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as actions from '../actions/user.action';
import { UserState } from '../states/user.state';

export const adapter: EntityAdapter<UserDto> = createEntityAdapter<UserDto>({
  sortComparer: sortByUserName,
  selectId: (user: UserDto) => user._id,
});

export function sortByUserName(a: UserDto, b: UserDto): number {
  return a.username.localeCompare(b.username);
}

export const initialstate: UserState = adapter.getInitialState({
  error: null,
  userInfos: null,
  pageMetadata: null,
  pageOptions: {
    limit: 10,
    page: 1,
    sortedBy: 'name',
    order: 'asc',
  },
  likes: [],
  suggestions: [],
  confirmed: false,
  canConnectToWebsocket: false,
});

const authReducer = createReducer(
  initialstate,
  on(actions.LogIn, (state) => ({
    ...state,
    error: null,
  })),
  on(actions.LogInSuccess, (state, { userInfos }) => ({
    ...state,
    userInfos: userInfos,
  })),
  on(actions.DisconnectSuccess, (state) => ({
    ...state,
    userInfos: null,
    error: null,
  })),
  on(actions.RefreshTokens, (state) => ({
    ...state,
    userInfos: null,
  })),
  on(actions.RefreshTokensSuccess, (state, { userInfos }) => ({
    ...state,
    userInfos: userInfos,
    error: null,
  })),
  on(actions.RefreshTokensError, (state, { error }) => ({
    ...state,
    userInfos: null,
    error,
  })),
  on(actions.ConfirmEmail, (state) => ({
    ...state,
    confirmed: false,
    error: null,
  })),
  on(actions.ConfirmEmailSuccess, (state) => ({
    ...state,
    confirmed: true,
    error: null,
  })),
  on(actions.SendConfirmationEmail, (state) => ({
    ...state,
    error: null,
  })),
  on(actions.SendConfirmationEmailSuccess, (state, { userInfos }) => ({
    ...state,
    userInfos: userInfos,
    error: null,
  })),
  /// User actions
  on(actions.GetUsersPaginatedSuccess, (state, { pageResults }) => {
    return adapter.setAll(pageResults.docs, {
      ...state,
      pageMetadata: {
        totalDocs: pageResults.totalDocs,
        limit: pageResults.limit,
        totalPages: pageResults.totalPages,
        page: pageResults.page,
        pagingCounter: pageResults.pagingCounter,
        hasPrevPage: pageResults.hasPrevPage,
        hasNextPage: pageResults.hasNextPage,
        prevPage: pageResults.prevPage,
        nextPage: pageResults.nextPage,
      },
      error: null,
    });
  }),
  on(actions.FetchUsersSuccess, (state, { users }) => {
    return adapter.addMany(users, { ...state, error: null });
  }),
  on(actions.ChangeMail, (state) => ({
    ...state,
    error: null,
  })),
  on(actions.ChangeLangSuccess, (state, { userInfos }) => ({
    ...state,
    userInfos: userInfos,
    error: null,
  })),
  on(actions.ChangeMailSuccess, (state, { userInfos }) => ({
    ...state,
    userInfos: userInfos,
    error: null,
  })),
  on(actions.ChangePassword, (state) => ({
    ...state,
    error: null,
  })),
  on(actions.ChangePasswordSuccess, (state) => ({
    ...state,
    error: null,
  })),
  on(actions.Register, (state) => ({
    ...state,
    error: null,
  })),
  on(actions.RegisterSuccess, (state, { userInfos }) => ({
    ...state,
    userInfos: userInfos,
    error: null,
  })),
  on(actions.GetUserInfosSuccess, (state, { userInfos }) => ({
    ...state,
    userInfos: userInfos,
    error: null,
  })),
  on(actions.UserError, (state, { error }) => ({
    ...state,
    error: error,
  })),
  on(actions.UpdateUserSuccess, (state, { updated }) => {
    return adapter.updateOne(
      { id: updated._id, changes: updated },
      { ...state, error: null }
    );
  }),
  on(actions.DeleteUserSuccess, (state, { userId }) => {
    return adapter.removeOne(userId, { ...state, error: null });
  }),
  on(actions.SearchUserSuccess, (state, { suggestions }) => ({
    ...state,
    suggestions: suggestions,
    error: null,
  })),
  on(actions.GetWebsocketAccessSuccess, (state) => ({
    ...state,
    canConnectToWebsocket: true,
  })),
  on(actions.WebsocketAccessError, (state, { error }) => ({
    ...state,
    canConnectToWebsocket: false,
    error: error,
  }))
);

export function reducer(state: UserState | undefined, action: Action) {
  return authReducer(state, action);
}

export const { selectAll, selectEntities, selectIds, selectTotal } =
  adapter.getSelectors();

export const selectAllAgents = selectAll;
