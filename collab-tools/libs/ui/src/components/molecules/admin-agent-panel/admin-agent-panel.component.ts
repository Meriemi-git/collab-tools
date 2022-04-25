import { Component, HostListener, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AbsctractObserverComponent } from '@collab-tools/bases';
import { Agent, Gadget } from '@collab-tools/datamodel';
import {
  AddAgent,
  DeleteAgent,
  FetchAgents,
  FetchGadgets,
  getAllAgents,
  getAllGadgets,
  StratEditorState,
  UpdateAgent,
} from '@collab-tools/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'collab-tools-admin-agent-panel',
  templateUrl: './admin-agent-panel.component.html',
  styleUrls: ['./admin-agent-panel.component.scss'],
})
export class AdminAgentPanelComponent
  extends AbsctractObserverComponent
  implements OnInit
{
  public $agents: Observable<Agent[]>;
  public $gadgets: Observable<Gadget[]>;
  public agent: Agent;
  private draggedAgent: Agent;

  constructor(private readonly store: Store<StratEditorState>) {
    super();
  }

  ngOnInit(): void {
    this.$agents = this.store
      .select(getAllAgents)
      .pipe(takeUntil(this.unsubscriber));
    this.$gadgets = this.store
      .select(getAllGadgets)
      .pipe(takeUntil(this.unsubscriber));
    this.store.dispatch(FetchGadgets());
    this.store.dispatch(FetchAgents());
  }
  /**
   * Agent section
   */
  onAgentAdded(data: FormData) {
    this.store.dispatch(AddAgent({ data }));
  }

  onAgentUpdated(data: FormData) {
    this.store.dispatch(UpdateAgent({ data }));
  }

  onAgentDeleted(agentId: string) {
    this.store.dispatch(DeleteAgent({ agentId }));
    this.agent = null;
  }

  onAgentDragged(agent: Agent) {
    this.agent = null;
    this.draggedAgent = agent;
  }

  @HostListener('drop', ['$event'])
  onwindowDrop(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.agent = this.draggedAgent;
  }
}
