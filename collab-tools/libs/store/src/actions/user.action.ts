import { HttpErrorResponse } from '@angular/common/http';
import {
  AnonUser,
  Language,
  PageOptions,
  PaginateResult,
  PasswordChangeWrapper,
  UserDto,
} from '@collab-tools/datamodel';
import { createAction, props } from '@ngrx/store';

export const GetUsersPaginated = createAction(
  '[User] Get paginated users',
  props<{ pageOptions: PageOptions }>()
);

export const GetUsersPaginatedSuccess = createAction(
  '[User] Get paginated users Success',
  props<{ pageResults: PaginateResult<UserDto> }>()
);

export const FetchUsersSuccess = createAction(
  '[User] Fetch Users Success',
  props<{ users: UserDto[] }>()
);

export const GetUserInfos = createAction('[User] Get User infos');

export const GetUserInfosSuccess = createAction(
  '[User] Get User infos Success',
  props<{ userInfos: UserDto }>()
);

export const UserError = createAction(
  '[User] User Error',
  props<{ error: HttpErrorResponse }>()
);

export const ChangePassword = createAction(
  '[User] Change Password',
  props<{ passwords: PasswordChangeWrapper }>()
);

export const ChangePasswordSuccess = createAction(
  '[User] Change Password success'
);

export const ChangeMail = createAction(
  '[User] Change Mail',
  props<{ newMail: string }>()
);

export const ChangeLang = createAction(
  '[User] Change language',
  props<{ lang: Language }>()
);

export const ChangeLangSuccess = createAction(
  '[User] Change language success',
  props<{ userInfos: UserDto }>()
);

export const ChangeMailSuccess = createAction(
  '[User] Change Mail success',
  props<{ userInfos: UserDto }>()
);

export const Register = createAction(
  '[User] Register',
  props<{ userDto: Partial<UserDto> }>()
);

export const RegisterSuccess = createAction(
  '[User] Register Success',
  props<{ userInfos: UserDto }>()
);

export const SendConfirmationEmail = createAction(
  '[Auth] Send confirmation email'
);

export const SendConfirmationEmailSuccess = createAction(
  '[Auth] Send confirmation email success',
  props<{ userInfos: UserDto }>()
);

export const UpdateUser = createAction(
  '[User] Update user',
  props<{ updated: UserDto }>()
);

export const UpdateUserSuccess = createAction(
  '[User] Update user success',
  props<{ updated: UserDto }>()
);

export const DeleteUser = createAction(
  '[User] Delete user',
  props<{ deleted: UserDto }>()
);

export const DeleteUserSuccess = createAction(
  '[User] Delete user success',
  props<{ userId: string }>()
);

export const LogIn = createAction(
  '[User] LogIn',
  props<{ userDto: Partial<UserDto> }>()
);

export const LogInSuccess = createAction(
  '[User] LogIn Success',
  props<{ userInfos: UserDto }>()
);
export const RefreshTokens = createAction('[Auth] RefreshTokens');

export const RefreshTokensSuccess = createAction(
  '[User] RefreshTokens Success',
  props<{ userInfos: UserDto }>()
);

export const RefreshTokensError = createAction(
  '[User] RefreshTokens Error',
  props<{ error: HttpErrorResponse }>()
);

export const Disconnect = createAction(
  '[User] Disconnect',
  props<{ withNotif: boolean }>()
);

export const DisconnectSuccess = createAction('[Auth] Disconnect Success');

export const ConfirmEmail = createAction(
  '[User] ConfirmEmail ',
  props<{ token: string }>()
);

export const ConfirmEmailSuccess = createAction('[Auth] ConfirmEmail Success');

export const SearchUser = createAction(
  '[User] Search user',
  props<{ text: string }>()
);

export const SearchUserSuccess = createAction(
  '[User] Search user success',
  props<{ suggestions: string[] }>()
);

export const GetWebsocketAccess = createAction('[User] Get Websocket access');

export const GetWebsocketAccessSuccess = createAction(
  '[Chat] Get Websocket access success'
);

export const WebsocketAccessError = createAction(
  '[User] Websocket Access Error',
  props<{ error: HttpErrorResponse }>()
);

export const SetAnonUser = createAction(
  '[User] Create anon user',
  props<{ anonUser: AnonUser }>()
);
