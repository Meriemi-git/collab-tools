import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ServicesModule } from '@collab-tools/services';
import { TabViewModule } from 'primeng/tabview';
import { AdminAgentPanelModule } from '../../molecules/admin-agent-panel/admin-agent-panel.module';
import { AdminGadgetPanelModule } from '../../molecules/admin-gadget-panel/admin-gadget-panel.module';
import { AdminStratMapPanelModule } from '../../molecules/admin-strat-map-panel/admin-strat-map-panel.module';
import { AdminUserPanelModule } from '../../molecules/admin-user-panel/admin-user-panel.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ServicesModule,
    TabViewModule,
    AdminUserPanelModule,
    AdminStratMapPanelModule,
    AdminAgentPanelModule,
    AdminGadgetPanelModule,
  ],
})
export class AdminModule {}
