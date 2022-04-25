import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ChatService } from '@collab-tools/services';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as actions from '../actions/chat.action';
import { DisplayMessage } from '../actions/notification.action';
import { StratEditorState } from '../reducers';

@Injectable()
export class ChatEffect {
  private readonly CHAT_SERVICE_SUMMARY = _('chat-service.summary');

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store<StratEditorState>,
    private readonly chatService: ChatService
  ) {}

  getAllChats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.GetAllChats),
      mergeMap(() =>
        this.chatService.getAllChats().pipe(
          map((chats) => actions.GetAllChatsSuccess({ chats })),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('chat-service.error.get-all'),
                  titleKey: this.CHAT_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.ChatError({ error }));
          })
        )
      )
    )
  );

  createChat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.CreateChat),
      mergeMap((action) =>
        this.chatService.createChat(action.members).pipe(
          map((chat) => actions.CreateChatSuccess({ chat })),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('chat-service.error.create-chat'),
                  titleKey: this.CHAT_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.ChatError({ error }));
          })
        )
      )
    )
  );

  leaveChat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.LeaveChat),
      mergeMap((action) =>
        this.chatService.leaveChat(action.chatId).pipe(
          map(() => actions.LeaveChatSuccess({ chatId: action.chatId })),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('chat-service.error.leave-chat'),
                  titleKey: this.CHAT_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.ChatError({ error }));
          })
        )
      )
    )
  );

  joinChat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.JoinChat),
      mergeMap((action) =>
        this.chatService.joinChat(action.chatId).pipe(
          map((chat) => actions.JoinChatSuccess({ chat })),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('chat-service.error.leave-chat'),
                  titleKey: this.CHAT_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.ChatError({ error }));
          })
        )
      )
    )
  );

  sendMessageToChat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.SendChatMessage),
      mergeMap((action) =>
        this.chatService.sendChatMessage(action.chatId, action.content).pipe(
          map((chatMessage) =>
            actions.SendChatMessageSuccess({
              chatId: action.chatId,
              chatMessage,
            })
          ),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(
              DisplayMessage({
                message: {
                  level: 'error',
                  messageKey: _('chat-service.error.send-chat-message'),
                  titleKey: this.CHAT_SERVICE_SUMMARY,
                },
              })
            );
            return of(actions.ChatError({ error }));
          })
        )
      )
    )
  );

  inviteUserToChat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.InviteUsersToChat),
      mergeMap((action) =>
        this.chatService
          .inviteUsersToChat(action.chatId, action.usernames)
          .pipe(
            map((chat) => actions.InviteUsersToChatSuccess({ chat })),
            catchError((error: HttpErrorResponse) => {
              this.store.dispatch(
                DisplayMessage({
                  message: {
                    level: 'error',
                    messageKey: _('chat-service.error.invite-users'),
                    titleKey: this.CHAT_SERVICE_SUMMARY,
                  },
                })
              );
              return of(actions.ChatError({ error }));
            })
          )
      )
    )
  );

  getLastMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.GetLastChatMessages),
      mergeMap((action) =>
        this.chatService.getLastChatMessages(action.chatId, action.time).pipe(
          map((chatMessages) =>
            actions.GetLastChatMessagesSuccess({
              chatMessages,
              chatId: action.chatId,
            })
          ),
          catchError((error: HttpErrorResponse) => {
            return of(actions.ChatError({ error }));
          })
        )
      )
    )
  );
}
