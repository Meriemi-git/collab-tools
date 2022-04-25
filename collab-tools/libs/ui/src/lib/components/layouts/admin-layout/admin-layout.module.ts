import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { AdminRoutingModule } from '../../../admin-routing.module';
import { LoginDialogModule } from '../../molecules/login-dialog/login-dialog.module';
import { AdminLayoutComponent } from './admin-layout.component';

@NgModule({
  declarations: [AdminLayoutComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ToolbarModule,
    ButtonModule,
    MenuModule,
    ToastModule,
    TranslateModule,
    LoginDialogModule,
  ],
  exports: [AdminLayoutComponent],
})
export class AdminLayoutModule {}
