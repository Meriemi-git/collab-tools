import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UserTableModule } from '../../atoms/user-table/user-table.module';
import { AdminUserPanelComponent } from './admin-user-panel.component';

@NgModule({
  declarations: [AdminUserPanelComponent],
  imports: [CommonModule, UserTableModule],
  exports: [AdminUserPanelComponent],
})
export class AdminUserPanelModule {}
