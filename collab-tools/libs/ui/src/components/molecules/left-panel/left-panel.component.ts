import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Agent } from '@collab-tools/datamodel';
import {
  closeLeft,
  DragAgent,
  getAllAgents,
  isAgentsPanelOpened,
  isGadgetsPanelOpened,
  isLeftSidenavOpened,
  StratEditorState,
} from '@collab-tools/store';
import { Observable } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AbsctractObserverComponent } from '@collab-tools/bases';

@Component({
  selector: 'collab-tools-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss'],
})
export class LeftPanelComponent
  extends AbsctractObserverComponent
  implements OnInit
{
  $isAgentsPanelOpened: Observable<boolean>;
  $isGadgetsPanelOpened: Observable<boolean>;
  $agents: Observable<Agent[]>;
  public leftIsOpened: boolean;
  constructor(private readonly store: Store<StratEditorState>) {
    super();
  }

  ngOnInit(): void {
    this.$agents = this.store
      .select(getAllAgents)
      .pipe(takeUntil(this.unsubscriber));
    this.$isAgentsPanelOpened = this.store
      .select(isAgentsPanelOpened)
      .pipe(takeUntil(this.unsubscriber));
    this.$isGadgetsPanelOpened = this.store
      .select(isGadgetsPanelOpened)
      .pipe(takeUntil(this.unsubscriber));
    this.store
      .select(isLeftSidenavOpened)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((isOpened) => {
        this.leftIsOpened = isOpened;
      });
  }

  onAgentDragged(agent: Agent) {
    this.store.dispatch(DragAgent({ agent }));
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
