import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { PasswordChangerComponent } from './password-changer.component';

@NgModule({
  declarations: [PasswordChangerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule,
    ButtonModule,
    TranslateModule,
  ],
  exports: [PasswordChangerComponent],
})
export class PasswordChangerModule {}
