import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TabViewModule } from 'primeng/tabview';
import { PipesModule } from '../../../pipes.module';
import { AgentItemModule } from '../../atoms/agent-item/agent-item.module';
import { AgentsPanelComponent } from './agents-panel.component';

@NgModule({
  declarations: [AgentsPanelComponent],
  imports: [
    CommonModule,
    PipesModule,
    TabViewModule,
    AgentItemModule,
    ScrollPanelModule,
    TranslateModule,
  ],
  exports: [AgentsPanelComponent],
})
export class AgentsPanelModule {}
