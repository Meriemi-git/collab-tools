import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';
import { FrontendRoutingModule } from '../../../lib/frontend-routing.module';
import { TopBarModule } from '../../atoms/top-bar/top-bar.module';
import { ChatsPanelModule } from '../../molecules/chats-panel/chats-panel.module';
import { LoginDialogModule } from '../../molecules/login-dialog/login-dialog.module';
import { RegisterDialogModule } from '../../molecules/register-dialog/register-dialog.module';
import { FrontendLayoutComponent } from './frontend-layout.component';
@NgModule({
  declarations: [FrontendLayoutComponent],
  imports: [
    CommonModule,
    TopBarModule,
    FrontendRoutingModule,
    SidebarModule,
    ButtonModule,
    DynamicDialogModule,
    LoginDialogModule,
    RegisterDialogModule,
    ConfirmDialogModule,
    ToastModule,
    ChatsPanelModule,
  ],
  exports: [FrontendLayoutComponent],
  providers: [MessageService],
})
export class FrontendLayoutModule {}
