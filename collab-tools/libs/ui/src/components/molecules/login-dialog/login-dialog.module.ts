import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { LoginDialogComponent } from './login-dialog.component';

@NgModule({
  declarations: [LoginDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    TranslateModule,
    PasswordModule,
  ],
  exports: [LoginDialogComponent],
})
export class LoginDialogModule {}
