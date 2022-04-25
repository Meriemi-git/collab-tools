import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { RoomService } from '@collab-tools/services';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { DisplayMessage } from '../actions/notification.action';
import * as actions from '../actions/room.action';
import { NotificationState } from '../states/notifications.state';

@Injectable()
export class RoomEffect {
  private readonly ROOM_SERVICE_SUMMARY = _('room-service.summary');
  constructor(
    private readonly actions$: Actions,
    private readonly roomService: RoomService,
    private readonly store: Store<NotificationState>
  ) {}

  createRoom$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.CreateRoom),
      mergeMap(() =>
        this.roomService.createRoom().pipe(
          map((room) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('room-service.success.create'),
                  titleKey: this.ROOM_SERVICE_SUMMARY,
                },
              })
            );
            return actions.CreateRoomSuccess({ room });
          }),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('room-service.error.create'),
                  titleKey: this.ROOM_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.RoomError({ error }));
          })
        )
      )
    )
  );

  inviteUsersToRoom$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.InviteUsersToRoom),
      mergeMap((action) =>
        this.roomService
          .inviteUsersToRoom(action.usernames, action.roomId)
          .pipe(
            map((room) => {
              this.store.dispatch(
                DisplayMessage({
                  message: {
                    level: 'success',
                    messageKey: _('room-service.success.invite'),
                    titleKey: this.ROOM_SERVICE_SUMMARY,
                  },
                })
              );
              return actions.InviteUsersToRoomSuccess({ room });
            }),
            catchError((error: HttpErrorResponse) => {
              let messageKey: string;
              if (error.status === 467) {
                messageKey = _('room-service.error._to_many_members');
              } else if (error.status === 468) {
                messageKey = _('room-service.error.already_present');
              } else {
                messageKey = _('room-service.error.invite');
              }
              this.store.dispatch(
                DisplayMessage({
                  message: {
                    level: 'error',
                    messageKey,
                    titleKey: this.ROOM_SERVICE_SUMMARY,
                  },
                })
              );
              return of(actions.RoomError({ error }));
            })
          )
      )
    )
  );

  ejectUserFromRoom$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.EjectUserFromRoom),
      mergeMap((action) =>
        this.roomService.ejectUsersFromRoom(action.roomId, action.userId).pipe(
          map((room) => {
            return actions.EjectUserFromRoomSuccess({ room });
          }),
          catchError((error: HttpErrorResponse) => {
            const messageKey = _('room-service.error.eject');
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey,
                  titleKey: this.ROOM_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.RoomError({ error }));
          })
        )
      )
    )
  );

  leaveRoom$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.LeaveRoom),
      mergeMap((action) =>
        this.roomService.leaveRoom(action.roomId).pipe(
          map((room) => {
            return actions.LeaveRoomSuccess({ room });
          }),
          catchError((error: HttpErrorResponse) => {
            const messageKey = _('room-service.error.leave');
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey,
                  titleKey: this.ROOM_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.RoomError({ error }));
          })
        )
      )
    )
  );

  joinRoom$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.JoinRoom),
      mergeMap((action) =>
        this.roomService.joinRoom(action.roomId).pipe(
          map((room) => {
            return actions.JoinRoomSuccess({ room });
          }),
          catchError((error: HttpErrorResponse) => {
            const messageKey = _('room-service.error.join');
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey,
                  titleKey: this.ROOM_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.RoomError({ error }));
          })
        )
      )
    )
  );

  getOwnRoom$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.GetOwnRoom),
      mergeMap(() =>
        this.roomService.getOwnRoom().pipe(
          map((room) => actions.GetOwnRoomSuccess({ room })),
          catchError((error: HttpErrorResponse) =>
            of(actions.RoomError({ error }))
          )
        )
      )
    )
  );

  getAllRooms = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.GetAllRooms),
      mergeMap(() =>
        this.roomService.getAllRooms().pipe(
          map((rooms) => actions.GetAllRoomsSuccess({ rooms })),
          catchError((error: HttpErrorResponse) =>
            of(actions.RoomError({ error }))
          )
        )
      )
    )
  );

  closeRoom$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.CloseRoom),
      mergeMap(() =>
        this.roomService.closeRoom().pipe(
          map(() => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'success',
                  messageKey: _('room-service.success.close'),
                  titleKey: this.ROOM_SERVICE_SUMMARY,
                },
              })
            );
            return actions.CloseRoomSuccess();
          }),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('room-service.error.close'),
                  titleKey: this.ROOM_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.RoomError({ error }));
          })
        )
      )
    )
  );
}
