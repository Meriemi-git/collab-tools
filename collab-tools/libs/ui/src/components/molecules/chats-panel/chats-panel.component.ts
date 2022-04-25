import { Component, Input, OnInit } from '@angular/core';
import {
  AbsctractObserverComponent,
  IChatSocketListener,
} from '@collab-tools/bases';
import {
  Chat,
  ChatMessage,
  UserDto,
  WebsocketMemberStatus,
  WebsocketStatus,
} from '@collab-tools/datamodel';
import {
  canConnectToWebsockets,
  CloseCurrentChat,
  CollabToolsState,
  CreateChat,
  GetAllChats,
  getAllChats,
  getCurrentChat,
  GetLastChatMessages,
  GetWebsocketAccess,
  InviteUsersToChat,
  JoinChat,
  LeaveChat,
  SelectChat,
  SendChatMessage,
  SendChatMessageSuccess,
  UpdateChatMemberStatus,
} from '@collab-tools/store';
import { ChatWebSocketService } from '@collab-tools/websocket';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'collab-tools-chats-panel',
  templateUrl: './chats-panel.component.html',
  styleUrls: ['./chats-panel.component.scss'],
})
export class ChatsPanelComponent
  extends AbsctractObserverComponent
  implements OnInit, IChatSocketListener
{
  @Input()
  public userInfos: UserDto;

  public $chats: Observable<Chat[]>;
  public $messages: Observable<ChatMessage[]>;
  public $canJoinChats: Observable<boolean>;
  public $currentChat: Observable<Chat>;

  public currentChatId: string;
  public invitePanelOpened = false;
  public WStatus = WebsocketStatus;

  constructor(
    private readonly store: Store<CollabToolsState>,
    private readonly chatWsService: ChatWebSocketService,
    protected readonly t: TranslateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.$chats = this.store
      .select(getAllChats)
      .pipe(takeUntil(this.unsubscriber));
    this.$canJoinChats = this.store
      .select(canConnectToWebsockets)
      .pipe(takeUntil(this.unsubscriber));
    this.$currentChat = this.store
      .select(getCurrentChat)
      .pipe(takeUntil(this.unsubscriber));
    this.$canJoinChats
      .pipe(takeUntil(this.unsubscriber))
      .pipe(take(2))
      .subscribe((canJoin) => {
        if (canJoin) {
          this.chatWsService.connectToWS(this);
        } else {
          this.store.dispatch(GetWebsocketAccess());
        }
      });
    this.$currentChat.subscribe(
      (currentchat) => (this.currentChatId = currentchat?._id)
    );
    this.$chats.pipe(takeUntil(this.unsubscriber)).subscribe((chats) => {
      if (chats) {
        chats.forEach((chat) => {
          if (!chat.joined) {
            this.store.dispatch(JoinChat({ chatId: chat._id }));
          }
        });
      }
    });
    this.store.dispatch(GetAllChats());
  }

  public createChat(): void {
    this.store.dispatch(CreateChat({ members: null }));
  }

  public selectChat(chat: Chat): void {
    this.store.dispatch(SelectChat({ chatId: chat._id }));
  }

  public openInvitePanel() {
    this.invitePanelOpened = true;
  }

  public inviteAllUsersToChat(usernames: string[]) {
    this.invitePanelOpened = false;
    this.store.dispatch(
      InviteUsersToChat({ chatId: this.currentChatId, usernames })
    );
  }

  public closeCurrentChat(): void {
    this.store.dispatch(CloseCurrentChat({ chatId: this.currentChatId }));
  }

  public onLeaveChat(chat: Chat, event?: Event): void {
    event?.stopPropagation();
    event?.preventDefault();
    this.store.dispatch(LeaveChat({ chatId: chat._id }));
  }

  public onSendMessage(text: string) {
    this.store.dispatch(
      SendChatMessage({ chatId: this.currentChatId, content: text })
    );
  }

  public onLoadMoreMessages() {
    this.$currentChat.pipe(take(1)).subscribe((current) => {
      this.store.dispatch(
        GetLastChatMessages({
          chatId: current._id,
          time: current.messages[current.messages.length - 1].sendAt,
        })
      );
    });
  }

  onConnected(): void {
    throw new Error('Method not implemented.');
  }

  onConnectionClosed(reason: string): void {
    console.log('Connexion closed', reason);
  }

  onMessageReceived(chatMessage: ChatMessage): void {
    this.store.dispatch(
      SendChatMessageSuccess({ chatId: this.currentChatId, chatMessage })
    );
  }

  onStatusChanged(memberStatus: WebsocketMemberStatus): void {
    console.log('onStatusChanged', memberStatus);
    this.store.dispatch(
      UpdateChatMemberStatus({
        chatMemberId: memberStatus.userId,
        status: memberStatus.status,
        chatId: memberStatus.wsRoomId,
      })
    );
  }
}
