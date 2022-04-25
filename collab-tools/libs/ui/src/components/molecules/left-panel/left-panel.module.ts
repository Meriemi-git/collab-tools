import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { AgentsPanelModule } from '../agents-panel/agents-panel.module';
import { GadgetPanelModule } from '../gadget-panel/gadget-panel.module';
import { LeftPanelComponent } from './left-panel.component';

@NgModule({
  declarations: [LeftPanelComponent],
  imports: [CommonModule, AgentsPanelModule, GadgetPanelModule, SidebarModule],
  exports: [LeftPanelComponent],
})
export class LeftPanelModule {}
