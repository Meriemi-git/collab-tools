import { Component } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
  CanvasDetails,
  SocketIODisconnectStatus,
  WebsocketMemberStatus,
  WebsocketStatus,
} from '@collab-tools/datamodel';
import {
  DisplayMessage,
  GetOwnRoom,
  StratEditorState,
} from '@collab-tools/store';
import { MessageService } from 'primeng/api';
import { AbsctractObserverComponent } from './abstract-observer.component';

@Component({ template: '' })
export abstract class AbstractRoomListenerComponent extends AbsctractObserverComponent {
  public connectedToTheRoom: boolean;
  public static readonly ROOM_SUMMARY = _('room.summary');
  constructor(
    protected readonly store: Store<StratEditorState>,
    protected readonly messageService: MessageService,
    protected readonly t: TranslateService
  ) {
    super();
  }

  public onConnectionClosed(reason: string) {
    if (this.connectedToTheRoom) {
      let messageKey: string;
      switch (reason) {
        case SocketIODisconnectStatus.CONNEXION_ERROR:
          messageKey = _('room-panel.error.connection_error');
          break;
        case SocketIODisconnectStatus.SERVER_SHUTDOWN:
          messageKey = _('room-panel.error.server_shutdown');
          break;
        case SocketIODisconnectStatus.PING_TIMEOUT:
          messageKey = _('room-panel.error.ping_timeout');
          break;
        case SocketIODisconnectStatus.CONNEXION_LOST:
          messageKey = _('room-panel.error.connexion_lost');
          break;
        default:
          return;
      }
      this.store.dispatch(
        DisplayMessage({
          message: {
            level: 'error',
            messageKey: messageKey,
            titleKey: _('room-service.summary'),
          },
        })
      );
    }
    this.connectedToTheRoom = false;
  }

  public onException(code: number) {
    let messageKey: string;
    switch (code) {
      case 400:
        messageKey = _('room.exception.bad-request');
        break;
      case 401:
        messageKey = _('room.exception.unauthorized');
        break;
      case 403:
        messageKey = _('room.exception.forbidden');
        break;
      default:
        messageKey = _('room.exception.unknown');
        break;
    }
    this.store.dispatch(
      DisplayMessage({
        message: {
          level: 'error',
          messageKey: messageKey,
          titleKey: _('room-service.summary'),
        },
      })
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onAskObjectsFromList(objectGuids: string[], memberId: string): void {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onBroadcastObjectList(details: CanvasDetails): void {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onObjectListSent(objects: unknown[]): void {}

  public onMyselfEjected(): void {}

  public onMemberStatusChange(memberStatus: WebsocketMemberStatus): void {
    let messageKey: string;
    let severity: 'success' | 'error' | 'warn' | 'info';
    switch (memberStatus.status) {
      case WebsocketStatus.JOINED:
        severity = 'info';
        messageKey = _('room.room_user_join');
        break;
      case WebsocketStatus.EJECTED:
        severity = 'warn';
        messageKey = _('room.room_user_ejected');
        this.onMyselfEjected();
        break;
      case WebsocketStatus.LEAVED:
        severity = 'info';
        messageKey = _('room.room_user_leave');
        break;
      case WebsocketStatus.CLOSED:
        severity = 'success';
        this.connectedToTheRoom = false;
        messageKey = _('room.room_closed');
        break;
      default:
        break;
    }
    if (messageKey) {
      this.store.dispatch(
        DisplayMessage({
          message: {
            level: severity,
            messageKey: messageKey,
            titleKey: AbstractRoomListenerComponent.ROOM_SUMMARY,
            vars: { username: memberStatus.username },
          },
        })
      );
    }
    this.store.dispatch(GetOwnRoom());
  }

  public abstract onConnectedToWS(): void;

  protected myStatusChange(memberStatus: WebsocketMemberStatus): void {
    let messageKey: string;
    let severity: 'success' | 'error' | 'warn' | 'info';
    switch (memberStatus.status) {
      case WebsocketStatus.JOINED:
        this.connectedToTheRoom = true;
        messageKey = _('room.room_self_join');
        severity = 'success';
        break;
      case WebsocketStatus.DISCONNECTED:
        this.connectedToTheRoom = false;
        messageKey = _('room.room_self_disconnect');
        severity = 'warn';
        break;
      case WebsocketStatus.EJECTED:
        this.connectedToTheRoom = false;
        messageKey = _('room.room_self_ejected');
        severity = 'error';
        break;
      case WebsocketStatus.LEAVED:
        this.connectedToTheRoom = false;
        break;
      case WebsocketStatus.CLOSED:
        this.connectedToTheRoom = false;
        break;
    }
    if (messageKey) {
      this.store.dispatch(
        DisplayMessage({
          message: {
            level: severity,
            messageKey: messageKey,
            titleKey: AbstractRoomListenerComponent.ROOM_SUMMARY,
          },
        })
      );
    }
  }
}
