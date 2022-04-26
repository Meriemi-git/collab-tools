import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { UserService } from '@collab-tools/services';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { DisplayMessage } from '../actions/notification.action';
import * as actions from '../actions/user.action';
import { NotificationState } from '../states/notifications.state';

@Injectable()
export class UserEffect {
  private readonly USER_SERVICE_SUMMARY = _('user-service.summary');
  private readonly AUTH_SERVICE_SUMMARY = _('auth-service.summary');
  private readonly AUTH_SERVICE_CONFIRMATION_SUMMARY = _(
    'auth-service-confirmation.summary'
  );

  constructor(
    private readonly actions$: Actions,
    private readonly userService: UserService,
    private readonly store: Store<NotificationState>
  ) {}

  getUsersPaginated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.GetUsersPaginated),
      mergeMap((action) =>
        this.userService.getUsersPaginated(action.pageOptions).pipe(
          map((pageResults) =>
            actions.GetUsersPaginatedSuccess({ pageResults })
          ),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('gadget-service.error.get-all'),
                  titleKey: this.USER_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.UserError({ error }));
          })
        )
      )
    )
  );

  changeLang$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.ChangeLang),
      mergeMap((action) =>
        this.userService.changeLang(action.lang).pipe(
          map((userInfos) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('user-service.success.change-lang'),
                  titleKey: this.USER_SERVICE_SUMMARY,
                },
              })
            );
            return actions.ChangeLangSuccess({ userInfos });
          }),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('user-service.error.change-lang'),
                  titleKey: this.USER_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.UserError({ error }));
          })
        )
      )
    )
  );

  getUserInfos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.GetUserInfos),
      mergeMap(() =>
        this.userService.getUserInfos().pipe(
          map((userInfos) => actions.GetUserInfosSuccess({ userInfos })),
          catchError((error: HttpErrorResponse) =>
            of(actions.UserError({ error }))
          )
        )
      )
    )
  );

  changePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.ChangePassword),
      mergeMap((action) =>
        this.userService.changePassword(action.passwords).pipe(
          map(() => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('user-service.success.change-password'),
                  titleKey: this.USER_SERVICE_SUMMARY,
                },
              })
            );
            return actions.ChangePasswordSuccess();
          }),
          catchError((error: HttpErrorResponse) => {
            let messageKey: string;
            if (error.status === 466) {
              messageKey = _('user-service.error.change-password_current');
            } else {
              messageKey = _('user-service.error.change-password_unknown');
            }
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey,
                  titleKey: this.USER_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.UserError({ error }));
          })
        )
      )
    )
  );

  changeMail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.ChangeMail),
      mergeMap((action) =>
        this.userService.changeMail(action.newMail).pipe(
          map((userInfos) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('user-service.success.change-mail'),
                  titleKey: this.USER_SERVICE_SUMMARY,
                },
              })
            );
            return actions.ChangeMailSuccess({ userInfos });
          }),
          catchError((error: HttpErrorResponse) => {
            let messageKey: string;
            if (error.status === 467) {
              messageKey = _('user-service.error.change-mail_same_mail');
            } else if (error.status === 468) {
              messageKey = _('user-service.error.mail_already_taken');
            } else {
              messageKey = _('user-service.error.change-mail_unknown');
            }
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey,
                  titleKey: this.USER_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.UserError({ error }));
          })
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.Register),
      mergeMap((action) =>
        this.userService.register(action.userDto).pipe(
          map((userInfos) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('user-service.success.register'),
                  titleKey: this.USER_SERVICE_SUMMARY,
                },
              })
            );
            return actions.RegisterSuccess({ userInfos });
          }),
          catchError((error: HttpErrorResponse) => {
            let messageKey: string;
            if (error.status === 467) {
              messageKey = _('user-service.error.register.same_mail');
            } else if (error.status === 468) {
              messageKey = _('user-service.error.register.same_username');
            } else if (error.status === 469) {
              messageKey = _('user-service.error.register.cgu_aggreement');
            } else {
              messageKey = _('user-service.error.register.unknow');
            }
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey,
                  titleKey: this.USER_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.UserError({ error }));
          })
        )
      )
    )
  );

  sendConfirmationEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.SendConfirmationEmail),
      mergeMap(() =>
        this.userService.sendConfirmationEmail().pipe(
          map((userInfos) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('user-service.success.send-confirmation'),
                  titleKey: this.AUTH_SERVICE_CONFIRMATION_SUMMARY,
                },
              })
            );
            return actions.SendConfirmationEmailSuccess({ userInfos });
          }),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('user-service.error.send-confirmation'),
                  titleKey: this.AUTH_SERVICE_CONFIRMATION_SUMMARY,
                },
              })
            );
            return of(actions.UserError({ error }));
          })
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.UpdateUser),
      mergeMap((action) =>
        this.userService.updateUser(action.updated).pipe(
          map((updated) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('user-service.success.update'),
                  titleKey: this.USER_SERVICE_SUMMARY,
                },
              })
            );
            return actions.UpdateUserSuccess({ updated });
          }),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('user-service.error.update'),
                  titleKey: this.USER_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.UserError({ error }));
          })
        )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.DeleteUser),
      mergeMap((action) =>
        this.userService.deleteUser(action.deleted).pipe(
          map(() => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('user-service.success.delete'),
                  titleKey: this.USER_SERVICE_SUMMARY,
                },
              })
            );
            return actions.DeleteUserSuccess({ userId: action.deleted._id });
          }),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('user-service.error.delete'),
                  titleKey: this.USER_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.UserError({ error }));
          })
        )
      )
    )
  );

  logIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.LogIn),
      mergeMap((action) =>
        this.userService.login(action.userDto).pipe(
          map((userInfos) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('user-service.success.login'),
                  titleKey: this.AUTH_SERVICE_SUMMARY,
                },
              })
            );
            return actions.LogInSuccess({ userInfos });
          }),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('user-service.error.login'),
                  titleKey: this.AUTH_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.UserError({ error }));
          })
        )
      )
    )
  );

  refreshTokens$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.RefreshTokens),
      mergeMap(() =>
        this.userService.refreshToken().pipe(
          map((userInfos) => actions.RefreshTokensSuccess({ userInfos })),
          catchError((error: HttpErrorResponse) =>
            of(actions.RefreshTokensError({ error }))
          )
        )
      )
    )
  );

  disconnect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.Disconnect),
      mergeMap(() =>
        this.userService.disconnect().pipe(
          map(() => {
            DisplayMessage({
              message: {
                level: 'success',
                messageKey: _('user-service.success.disconnection'),
                titleKey: this.AUTH_SERVICE_SUMMARY,
              },
            });
            return actions.DisconnectSuccess();
          }),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('user-service.error.disconnection'),
                  titleKey: this.AUTH_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.UserError({ error }));
          })
        )
      )
    )
  );

  confirmEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.ConfirmEmail),
      mergeMap((action) =>
        this.userService.confirmEmail(action.token).pipe(
          map(() => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('user-service.success.email-confirmation'),
                  titleKey: this.AUTH_SERVICE_CONFIRMATION_SUMMARY,
                },
              })
            );
            return actions.ConfirmEmailSuccess();
          }),
          catchError((error: HttpErrorResponse) => {
            let messageKey: string;
            let level: 'error' | 'warn' = 'error';
            if (error.status === 467) {
              messageKey = _(
                'user-service.error.email-confirmation.link_invalid'
              );
            } else if (error.status === 468) {
              messageKey = _(
                'user-service.error.email-confirmation.link_expired'
              );
            } else if (error.status === 469) {
              messageKey = _(
                'user-service.error.email-confirmation.already_confirmed'
              );
              level = 'warn';
            } else {
              messageKey = _('user-service.error.email-confirmation.unknown');
            }
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level,
                  messageKey,
                  titleKey: this.AUTH_SERVICE_CONFIRMATION_SUMMARY,
                },
              })
            );
            return of(actions.UserError({ error }));
          })
        )
      )
    )
  );

  searchUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.SearchUser),
      mergeMap((action) =>
        this.userService.searchUsers(action.text).pipe(
          map((suggestions) => actions.SearchUserSuccess({ suggestions })),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('user-service.error.search'),
                  titleKey: this.USER_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.UserError({ error }));
          })
        )
      )
    )
  );

  getWebsocketAccessToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.GetWebsocketAccess),
      mergeMap(() =>
        this.userService.getWebsocketAccess().pipe(
          map(() => actions.GetWebsocketAccessSuccess()),
          catchError((error: HttpErrorResponse) => {
            let messageKey: string;
            if (error.status === 412) {
              messageKey = _('room-service.error.access_confirm_mail');
            } else {
              messageKey = _('room-service.error.access');
            }
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey,
                  titleKey: this.USER_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.WebsocketAccessError({ error }));
          })
        )
      )
    )
  );
}
