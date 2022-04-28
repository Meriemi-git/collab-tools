import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { LeftPanelComponent } from './left-panel.component';

@NgModule({
  declarations: [LeftPanelComponent],
  imports: [CommonModule, SidebarModule],
  exports: [LeftPanelComponent],
})
export class LeftPanelModule {}
