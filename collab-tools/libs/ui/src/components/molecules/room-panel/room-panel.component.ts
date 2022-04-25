import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractRoomListenerComponent } from '@collab-tools/bases';
import {
  CanvasDetails,
  Room,
  User,
  UserDto,
  WebsocketMember,
  WebsocketMemberStatus,
  WebsocketStatus,
} from '@collab-tools/datamodel';
import {
  canConnectToWebsockets,
  closeRight,
  CloseRoom,
  CollabToolsState,
  ConnectToRoomWSSuccess,
  CreateRoom,
  EjectUserFromRoom,
  getCanvas,
  GetOwnRoom,
  getOwnRoom,
  GetUserInfos,
  getUserInfos,
  GetWebsocketAccess,
  InviteUsersToRoom,
  isConnectedToRoomWS,
  JoinRoom,
  SearchUser,
} from '@collab-tools/store';
import { RoomWebSocketService } from '@collab-tools/websocket';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { first, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'collab-tools-room-panel',
  templateUrl: './room-panel.component.html',
  styleUrls: ['./room-panel.component.scss'],
})
export class RoomPanelComponent
  extends AbstractRoomListenerComponent
  implements OnInit, OnDestroy
{
  public userInfos: UserDto;
  public room: Room;
  public roomFormSubmitted: boolean;
  public RoomMemberStatusEnum = WebsocketStatus;
  public canvasUpdates$ = new Subject<string>();
  public roomId: string;

  public isBroadcasting = false;
  public filteredRoomMembers: WebsocketMember[] = [];

  constructor(
    @Inject('environment')
    private readonly environment,
    private readonly router: Router,
    protected readonly store: Store<CollabToolsState>,
    private readonly wsService: RoomWebSocketService,
    private readonly confirmationService: ConfirmationService,
    protected readonly messageService: MessageService,
    protected readonly t: TranslateService
  ) {
    super(store, messageService, t);
  }

  ngOnInit(): void {
    this.store
      .select(getUserInfos)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((userInfos) => {
        this.userInfos = userInfos;
      });

    this.store
      .select(canConnectToWebsockets)
      .pipe(take(2), takeUntil(this.unsubscriber))
      .subscribe((canJoin) => {
        if (canJoin) {
          this.wsService.connectToWS(this);
        } else {
          this.store.dispatch(GetWebsocketAccess());
        }
      });

    this.store
      .select(isConnectedToRoomWS)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((connected) => {
        this.store.dispatch(GetOwnRoom());
      });

    this.store
      .select(getOwnRoom)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((room) => {
        console.log('Get own room', room);
        this.room = room;
        if (room) {
          this.filteredRoomMembers = room.members.filter(
            (member) => member.userId !== this.userInfos?._id
          );
        }
      });
    this.store.dispatch(GetUserInfos());
  }

  public search(event) {
    this.store.dispatch(SearchUser({ text: event.query }));
  }

  public createRoom() {
    this.roomFormSubmitted = true;
    this.store
      .select(getOwnRoom)
      .pipe(first((room) => room != null))
      .subscribe((room) => {
        if (room) {
          this.joinRoom(room._id);
        }
      });
    this.store.dispatch(CreateRoom());
  }

  public redirectToRoom(roomId: string) {
    this.router.navigateByUrl(`room/${roomId}`);
  }

  public onInviteAll(usernames: string[]) {
    if (usernames?.length > 0) {
      this.store.dispatch(
        InviteUsersToRoom({
          usernames,
          roomId: this.room?._id,
        })
      );
    }
  }

  public isUserConnected(user: User): boolean {
    return this.room.members.some(
      (member) =>
        member.userId === user._id && member.status === WebsocketStatus.JOINED
    );
  }

  public ejectUserFromRoom(member: WebsocketMember) {
    this.store.dispatch(
      EjectUserFromRoom({ roomId: this.room._id, userId: member.userId })
    );
  }

  public closeRoom(event: Event) {
    this.t.get('room-panel.close-room.message').subscribe((message) => {
      this.confirmationService.confirm({
        message: message,
        target: event.target,
        icon: 'pi pi-exclamation-triangle',
        key: 'room-panel.close-room',
        accept: () => {
          this.connectedToTheRoom = false;
          this.store.dispatch(CloseRoom());
          this.store.dispatch(closeRight());
        },
      });
    });
  }

  public getRoomUrl() {
    return `${this.environment.host}/room/${this.room?._id}`;
  }

  public toogleBroadcast() {
    if (!this.isBroadcasting) {
      this.isBroadcasting = true;
      this.store
        .select(getCanvas)
        .pipe(takeUntil(this.unsubscriber))
        .subscribe((canvas) => {
          if (canvas) {
            const objecList = canvas['objects']
              .filter((object) => object.guid)
              .map((object) => object.guid);
            const details: CanvasDetails = {
              width: canvas['width'],
              height: canvas['height'],
              guids: objecList,
            };
            this.wsService.broadcastObjects(this.room._id, details);
          }
        });
    } else {
      this.isBroadcasting = false;
      this.unsubscriber.next(null);
    }
    this.store.dispatch(closeRight());
  }

  public canBroadcast() {
    return this.room?.members.some(
      (member) => member.status === WebsocketStatus.JOINED
    );
  }

  public joinRoom(roomId: string): void {
    if (this.wsService.isConnected()) {
      this.store.dispatch(JoinRoom({ roomId: roomId }));
      this.connectedToTheRoom = true;
    }
  }

  public onAskObjectsFromList(objectGuids: string[], memberId: string) {
    this.store
      .select(getCanvas)
      .pipe(take(1))
      .subscribe((canvas) => {
        const objectList: unknown[] = [];
        if (canvas) {
          canvas['objects']
            .filter((obj) => obj.guid)
            .forEach((obj) => {
              if (objectGuids.includes(obj.guid)) {
                objectList.push(obj);
              }
            });
          this.wsService.sendObjects(this.room._id, objectList, memberId);
        }
      });
  }

  public onMemberStatusChange(memberStatus: WebsocketMemberStatus): void {
    if (memberStatus.userId == this.userInfos._id) {
      super.myStatusChange(memberStatus);
    } else {
      if (memberStatus.status === WebsocketStatus.JOINED) {
        this.store
          .select(getCanvas)
          .pipe(take(1))
          .subscribe((canvas) => {
            if (canvas) {
              const objecList: string[] = canvas['objects']
                .filter((object) => object.guid)
                .map((object) => object.guid);
              const details: CanvasDetails = {
                width: canvas['width'],
                height: canvas['height'],
                guids: objecList,
              };
              this.wsService.broadcastObjects(this.room._id, details);
            }
          });
      }
      super.onMemberStatusChange(memberStatus);
    }
  }

  public onConnectedToWS(): void {
    this.store.dispatch(ConnectToRoomWSSuccess());
  }
}
