import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { AgentItemComponent } from './agent-item.component';
@NgModule({
  declarations: [AgentItemComponent],
  imports: [CommonModule, DividerModule],
  exports: [AgentItemComponent],
})
export class AgentItemModule {}
