import { Component, OnInit } from '@angular/core';
import { AbsctractObserverComponent } from '@collab-tools/bases';
import {
  closeLeft,
  CollabToolsState,
  isLeftSidenavOpened,
} from '@collab-tools/store';
import { Store } from '@ngrx/store';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'collab-tools-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss'],
})
export class LeftPanelComponent
  extends AbsctractObserverComponent
  implements OnInit
{
  public leftIsOpened: boolean;
  constructor(private readonly store: Store<CollabToolsState>) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(isLeftSidenavOpened)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((isOpened) => {
        this.leftIsOpened = isOpened;
      });
  }

  public onCloseLeftSidenav() {
    this.store
      .select(isLeftSidenavOpened)
      .pipe(take(1), takeUntil(this.unsubscriber))
      .subscribe((isOpen) => {
        if (isOpen) {
          this.store.dispatch(closeLeft());
        }
      });
  }

  public closeLeftSidenav() {
    this.store.dispatch(closeLeft());
  }
}
