import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AddAgentModule } from '../../atoms/add-agent/add-agent.module';
import { AgentItemModule } from '../../atoms/agent-item/agent-item.module';
import { AdminAgentPanelComponent } from './admin-agent-panel.component';

@NgModule({
  declarations: [AdminAgentPanelComponent],
  imports: [CommonModule, AddAgentModule, AgentItemModule, ScrollPanelModule],
  exports: [AdminAgentPanelComponent],
})
export class AdminAgentPanelModule {}
