import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MailChangerComponent } from './mail-changer.component';

@NgModule({
  declarations: [MailChangerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TranslateModule,
  ],
  exports: [MailChangerComponent],
})
export class MailChangerModule {}
