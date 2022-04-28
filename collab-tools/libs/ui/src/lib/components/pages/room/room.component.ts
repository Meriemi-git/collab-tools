import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractRoomListenerComponent } from '@collab-tools/bases';
import {
  CanvasDetails,
  UserDto,
  WebsocketMemberStatus,
} from '@collab-tools/datamodel';
import {
  AddObjectsToCanvas,
  canConnectToWebsockets,
  CollabToolsState,
  ConnectToRoomWSSuccess,
  getDistantCanvas,
  GetUserInfos,
  getUserInfos,
  isConnectedToRoomWS,
  isRoomJoined,
  JoinRoom,
  LeaveRoom,
  RemoveObjectsFromCanvas,
  SetDimensions,
} from '@collab-tools/store';
import { RoomWebSocketService } from '@collab-tools/websocket';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { first, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'collab-tools-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent
  extends AbstractRoomListenerComponent
  implements OnInit, OnDestroy
{
  public roomId: string;
  public userInfos$: Observable<UserDto>;
  public userInfos: UserDto;
  public $canConnectToWS: Observable<boolean>;
  public $roomJoined: Observable<boolean>;
  constructor(
    private readonly router: Router,
    private readonly activeRoute: ActivatedRoute,
    private readonly roomWsService: RoomWebSocketService,
    protected readonly store: Store<CollabToolsState>,
    protected readonly messageService: MessageService,
    protected readonly t: TranslateService
  ) {
    super(store, messageService, t);
  }

  ngOnInit(): void {
    this.userInfos$ = this.store.select(getUserInfos);
    this.$canConnectToWS = this.store.select(canConnectToWebsockets);
    this.activeRoute.paramMap
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((params) => {
        this.roomId = params.get('roomId');
        this.userInfos$
          .pipe(takeUntil(this.unsubscriber))
          .subscribe((userInfos) => {
            if (userInfos) {
              this.roomWsService.connectToWS(this);
            }
            this.userInfos = userInfos;
          });

        this.$roomJoined = this.store
          .select(isRoomJoined(this.roomId))
          .pipe(takeUntil(this.unsubscriber));
      });

    this.store
      .select(isConnectedToRoomWS)
      .pipe(
        first((connected) => connected),
        takeUntil(this.unsubscriber)
      )
      .subscribe(() => {
        this.store.dispatch(JoinRoom({ roomId: this.roomId }));
      });

    this.store.dispatch(GetUserInfos());
  }

  ngOnDestroy(): void {
    this.roomWsService.onDisconnect();
  }

  public leaveRoom() {
    this.store.dispatch(LeaveRoom({ roomId: this.roomId }));
  }

  private getObjectGuidsToRemove(
    objectList: string[],
    canvas: unknown
  ): string[] {
    const toBeRemoved: string[] = [];
    const canvasObjectGuids: string[] = canvas['objects'].map(
      (object) => object.guid
    );
    canvasObjectGuids.forEach((guid) => {
      if (!objectList.includes(guid)) {
        toBeRemoved.push(guid);
      }
    });
    return toBeRemoved;
  }

  private getObjectGuidsToAdd(objectList: string[], canvas: unknown): string[] {
    const toBeAdded: string[] = [];
    const canvasObjectGuids: string[] = canvas['objects'].map(
      (object) => object.guid
    );
    objectList.forEach((guid) => {
      if (!canvasObjectGuids.includes(guid)) {
        toBeAdded.push(guid);
      }
    });
    return toBeAdded;
  }

  public override onBroadcastObjectList(details: CanvasDetails): void {
    this.store
      .select(getDistantCanvas)
      .pipe(take(1))
      .subscribe((canvas) => {
        this.store.dispatch(
          SetDimensions({
            height: details.height,
            width: details.width,
          })
        );
        if (canvas) {
          const toBeRemoved = this.getObjectGuidsToRemove(
            details.guids,
            canvas
          );
          const toBeAdded = this.getObjectGuidsToAdd(details.guids, canvas);
          this.store.dispatch(RemoveObjectsFromCanvas({ guids: toBeRemoved }));
          this.roomWsService.askObjects(this.roomId, toBeAdded);
        } else {
          this.roomWsService.askObjects(this.roomId, details.guids);
        }
      });
  }

  public override onObjectListSent(objects: unknown[]): void {
    this.store.dispatch(AddObjectsToCanvas({ objects }));
  }

  public override onMemberStatusChange(
    memberStatus: WebsocketMemberStatus
  ): void {
    console.log('onMemberStatusChange', memberStatus);
    if (memberStatus.userId == this.userInfos._id) {
      super.myStatusChange(memberStatus);
    } else {
      super.onMemberStatusChange(memberStatus);
    }
  }

  public override onConnectedToWS(): void {
    this.store.dispatch(ConnectToRoomWSSuccess());
  }

  public onMyselfEjected(): void {
    this.router.navigateByUrl('/');
  }
}
