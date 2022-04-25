import { Component, OnInit } from '@angular/core';
import { AbsctractObserverComponent } from '@collab-tools/bases';
import { AuthInfos, Room, UserDto } from '@collab-tools/datamodel';
import {
  closeRight,
  CollabToolsState,
  getOwnRoom,
  getUserInfos,
  isDrawingPanelOpened,
  isGalleryPanelOpened,
  isRightSidenavOpened,
  isRoomPanelOpened,
} from '@collab-tools/store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'collab-tools-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.scss'],
})
export class RightPanelComponent
  extends AbsctractObserverComponent
  implements OnInit
{
  public $isDrawingPanelOpened: Observable<boolean>;
  public $isGalleryPanelOpened: Observable<boolean>;
  public $isRoomPanelOpened: Observable<boolean>;
  public $room: Observable<Room>;
  public $authInfos: Observable<AuthInfos>;
  public $userInfos: Observable<UserDto>;
  public rightIsOpened: boolean;
  constructor(private readonly store: Store<CollabToolsState>) {
    super();
  }

  ngOnInit(): void {
    this.$isDrawingPanelOpened = this.store
      .select(isDrawingPanelOpened)
      .pipe(takeUntil(this.unsubscriber));
    this.$isGalleryPanelOpened = this.store
      .select(isGalleryPanelOpened)
      .pipe(takeUntil(this.unsubscriber));
    this.$isRoomPanelOpened = this.store
      .select(isRoomPanelOpened)
      .pipe(takeUntil(this.unsubscriber));
    this.store
      .select(isRightSidenavOpened)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((isOpened) => {
        this.rightIsOpened = isOpened;
      });

    this.$userInfos = this.store
      .select(getUserInfos)
      .pipe(takeUntil(this.unsubscriber));
    this.$room = this.store
      .select(getOwnRoom)
      .pipe(takeUntil(this.unsubscriber));
  }

  public onCloseRightSidenav() {
    this.store
      .select(isRightSidenavOpened)
      .pipe(take(1), takeUntil(this.unsubscriber))
      .subscribe((isOpen) => {
        if (isOpen) {
          this.store.dispatch(closeRight());
        }
      });
  }

  public closeRightSidenav() {
    this.store.dispatch(closeRight());
  }
}
