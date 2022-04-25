import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
  AbsctractObserverComponent,
  INotificationSocketListener,
} from '@collab-tools/bases';
import {
  Notification,
  NotificationType,
  UserDto,
} from '@collab-tools/datamodel';
import {
  canConnectToWebsockets,
  CollabToolsState,
  Disconnect,
  DisplayMessage,
  getAllNotifications,
  GetAllNotifications,
  GetAllRooms,
  getMessage,
  getNumberOfNotifs,
  getUserInfos,
  GetWebsocketAccess,
} from '@collab-tools/store';
import { NotificationWebSocketService } from '@collab-tools/websocket';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoginDialogComponent } from '../../molecules/login-dialog/login-dialog.component';
import { RegisterDialogComponent } from '../../molecules/register-dialog/register-dialog.component';

@Component({
  selector: 'collab-tools-frontend-layout',
  templateUrl: './frontend-layout.component.html',
  styleUrls: ['./frontend-layout.component.scss'],
})
export class FrontendLayoutComponent
  extends AbsctractObserverComponent
  implements OnInit, INotificationSocketListener
{
  @ViewChild('mainToolbar') mainToolbar: ElementRef;

  public $userInfos: Observable<UserDto>;
  public $notifCounter: Observable<number>;
  public chatsOpened = false;
  constructor(
    @Inject('environment')
    private readonly environment,
    private readonly store: Store<CollabToolsState>,
    private readonly dialogService: DialogService,
    private readonly messageService: MessageService,
    private readonly translationService: TranslateService,
    private readonly notifWsService: NotificationWebSocketService
  ) {
    super();
  }

  ngOnInit(): void {
    this.store.select(getAllNotifications);
    this.$userInfos = this.store
      .select(getUserInfos)
      .pipe(takeUntil(this.unsubscriber));
    this.store
      .select(getMessage)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((message) => {
        if (message) {
          this.translationService
            .get([message.titleKey, message.messageKey], message.vars)
            .subscribe((translations) => {
              if (translations) {
                this.messageService.add({
                  severity: message.level,
                  summary: translations[message.titleKey],
                  detail: translations[message.messageKey],
                  life: 3000,
                });
              }
            });
        }
      });

    this.$userInfos
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((userInfos) => {
        if (userInfos) {
          this.store
            .select(canConnectToWebsockets)
            .pipe(takeUntil(this.unsubscriber))
            .subscribe((canJoin) => {
              if (canJoin) {
                this.notifWsService.connectToWS(this);
                this.notifWsService.$notifications.subscribe((notification) => {
                  if (notification) {
                    this.store.dispatch(GetAllNotifications());
                  }
                });
              }
            });
          this.store.dispatch(GetWebsocketAccess());
          this.store.dispatch(GetAllNotifications());
          this.store.dispatch(GetAllRooms());
        }
      });
    this.$notifCounter = this.store.select(getNumberOfNotifs);
  }

  public onDisconnect() {
    this.store.dispatch(Disconnect({ withNotif: true }));
  }

  public onLogin() {
    this.dialogService.open(LoginDialogComponent, {
      showHeader: false,
      closable: true,
      closeOnEscape: true,
    });
  }

  public onRegister() {
    this.dialogService.open(RegisterDialogComponent, {
      showHeader: false,
      closable: true,
      closeOnEscape: true,
    });
  }

  public onConnectionClosed(reason: string): void {
    console.log('notification onConnectionClosed', reason);
  }

  public onNotificationReceived(notification: Notification): void {
    this.displayNotification(notification);
  }

  private displayNotification(notification: Notification) {
    let titleKey: string;
    let messageKey: string;
    if (notification.type === NotificationType.CHAT_INVITATION) {
      titleKey = _('notification_chat_invitation_title');
      messageKey = _('notification_chat_invitation_message');
    } else if (notification.type === NotificationType.ROOM_INVITATION) {
      titleKey = _('notification_room_invitation_title');
      messageKey = _('notification_room_invitation_message');
    }
    this.store.dispatch(
      DisplayMessage({
        message: {
          level: 'info',
          titleKey: titleKey,
          messageKey: messageKey,
          vars: {
            wsRoomId: notification.wsRoomId,
            roomPageUrl: this.environment.roomPageUrl,
          },
          life: 3000,
        },
      })
    );
  }
}
