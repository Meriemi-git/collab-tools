import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { UserFinderModule } from '../user-finder/user-finder.module';
import { InvitationDialogComponent } from './invitation-dialog.component';

@NgModule({
  declarations: [InvitationDialogComponent],
  imports: [CommonModule, UserFinderModule, DynamicDialogModule],
  exports: [InvitationDialogComponent],
})
export class InvitationDialogModule {}
