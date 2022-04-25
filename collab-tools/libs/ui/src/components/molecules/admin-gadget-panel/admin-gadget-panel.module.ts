import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AddGadgetModule } from '../../atoms/add-gadget/add-gadget.module';
import { GadgetItemModule } from '../../atoms/gadget-item/gadget-item.module';
import { AdminGadgetPanelComponent } from './admin-gadget-panel.component';

@NgModule({
  declarations: [AdminGadgetPanelComponent],
  imports: [CommonModule, AddGadgetModule, GadgetItemModule, ScrollPanelModule],
  exports: [AdminGadgetPanelComponent],
})
export class AdminGadgetPanelModule {}
