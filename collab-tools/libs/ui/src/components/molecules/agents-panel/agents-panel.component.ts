import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Agent } from '@collab-tools/datamodel';

@Component({
  selector: 'collab-tools-agents-panel',
  templateUrl: './agents-panel.component.html',
  styleUrls: ['./agents-panel.component.scss'],
})
export class AgentsPanelComponent {
  @Input() agents: Agent[];
  @Input() maxColumns: number;
  @Output() agentDragged = new EventEmitter<Agent>();

  onAgentDragged(agent: Agent) {
    this.agentDragged.emit(agent);
  }
}
